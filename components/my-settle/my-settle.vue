<template>
	<view class="my-settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio :checked="isFullCheck" color="#C00000" /><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amount-box">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement" >
			结算({{checkedCount}})
		</view>
	</view>
</template>

<script>
	import {mapGetters,mapMutations,mapState} from 'vuex'
	export default {
		name:"my-settle",
		data() {
			return {
				// 倒计时的秒数
				seconds:3,
				// 定时器的id
				timer:null
			};
		},
		computed:{
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			...mapGetters('m_user',['addstr']),
			...mapState('m_user',['token']),
			...mapState('m_cart',['cart']),
			isFullCheck(){
				return this.total===this.checkedCount
			}
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			...mapMutations('m_user',['updateRedirectInfo']),
			changeAllState(){
				this.updateAllGoodsState(!this.isFullCheck)
			},
			// 延时跳转到登陆页面
			delayNavigate(){
				this.seconds=3
				this.showTips(this.seconds)
				 this.timer= setInterval(()=>{
					this.seconds--
					if(this.seconds<=0){
						clearInterval(this.timer)
						uni.switchTab({
							url:'/pages/my/my',
							success: () => {
								this.updateRedirectInfo({
									openType:'switchTab',
									from:'/pages/cart/cart'
								})
							}
						})
						return 
					}
					this.showTips(this.seconds)
				},1000)
			},
			// 用户点击了结算按钮
			settlement(){
				if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
				if(!this.addstr) return uni.$showMsg('请选择收货地址！')
				if(!this.token) return this.delayNavigate()
				
				// 实现微信支付功能
				this.payOrder()
			},
			// 展示倒计时的提示消息
			showTips(n){
				uni.showToast({
					icon:'none',
					title:'请登录后再结算!'+ n + '秒之后转到登录',
					mask:true,
					duration:3000
				})
			},
			 async payOrder(){
				// 组织订单的信息对象
				const orderInfo={
					// order_price:this.checkedGoodsAmount
					// 开发期间避免误付款，写死订单为一份钱
					order_price:0.01,
					consignee_addr:this.addstr,
					goods:this.cart.filter(x=>x.goods_state).map(x=>({goods_id:x.goods_id,goods_number:x.goods_count,goods_price:x.goods_price}))
				}
				
				// 发起请求创建订单
				 const{data:res}=await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
				 if(res.meta.status!==200) return uni.$showMsg('创建订单失败！')
				 
				 // 得到服务器响应的订单编号
				 const orderNumber=res.message.order_number
				 // console.log(orderNumber)
				 // 订单预支付
				 // 发起请求获取订单
				 const {data:res2} =await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder',{order_number:orderNumber})
				 // 预付订单生成失败
				 // if(res2.meta.status!==200) return uni.$showMsg('预付订单生成失败！')
				 // 得到订单支付相关的必要参数
				 // console.log(res2)
				 const payInfo=res2.message.pay
				 // console.log(payInfo)
				 // 发起微信支付
				 // 调用uni.requestPayment()发起微信支付
				 const [err,succ] =await uni.requestPayment(payInfo)
				 // 未完成支付
				 if(err) return uni.$showMsg('订单未支付！')
				 // 进一步查询支付的结果
				 const {data:res3} =await uni.$http.post('/api/public/v1/my/orders/chkOrder',{order_number:orderNumber})
				 // 检测到订单未支付完成
				 if(res3.meta.status!==200) return uni.$showMsg('订单未支付！')
				 // 检测到订单支付完成
				 uni.showToast({
					 title:'支付完成!',
					 icon:'success'
				 })
			}
			
		}
	}
</script>

<style lang="scss">
.my-settle-container{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background-color:white;
	z-index: 999;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;
	
	
	.radio{
		display: flex;
		align-items: center;

	}
	.amount-box{
		.amount{
			color: #C00000;
			font-weight: bold;
		}
	}
	.btn-settle{
		background-color: #C00000;
		height: 50px;
		color: white;
		line-height: 50px;
		padding: 0 10px;
		min-width: 100px;
		text-align: center;
	}
}
</style>