<template>
	<view v-if="goods_info.goods_name" class="detail-container">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,i) in goods_info.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			
			<!-- 信息主体区域 -->
			<view class="goods-info-body">
				
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>
		
		<!-- 商品信息详情 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		
		<!-- 商品导航组件 -->
		<view class="goods_nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
		
		
	</view>
</template>

<script>
	// 从vuex中按需导入mapstate方法
	import {mapState} from 'vuex'
	
	// 按需导入mapMutations方法
	import {mapMutations} from 'vuex'
	
	// 按需导入mapGetters方法
	import {mapGetters} from 'vuex'
	
	export default {
		computed:{
			// 调用mapstate方法，把m_cart模块中的cart数据映射到当前页面中，作为计算属性
			// ...mapState('模块名称'，['要映射的数据名称1'，'要映射的数据名称2'])
			...mapState('m_cart',[]),
			// ...mapMutations('m_cart',['addToCart']),
			...mapGetters('m_cart',['total'])
		},
		watch:{
			// 监听total 的数据变化，通过第一个形参得到变化的值
			
			total:{
				handler(newVal){
					const findResult=this.options.find((x)=>x.text==='购物车')
					
					if(findResult){
						// 动态为购物车的按钮info属性赋值
						findResult.info=newVal
					}
				},
				// 首次加载的时候就立即被调用
				immediate:true
			}
		},
		
		data() {
			return {
				// 商品详情对象
				goods_info:{},
				options:[
					{
						icon:'shop',
						text:'店铺'
					},{
						icon:'cart',
						text:'购物车',
						info:2
					}
				],
				buttonGroup:[{
					text:'加入购物车',
					backgroundColor:'#ffa200',
					color:'#fff'
				},{
					text:'立即购买',
					backgroundColor:'#ffa200',
					color:'#fff'
				}
				]
			};
		},
		
		onLoad(options) {
			// 获取传过来的商品Id
			const goods_id=options.goods_id
			// 调用请求商品详情数据的方法
			this.getGoodsDetail(goods_id)
		},
		
		methods:{
			 async getGoodsDetail(goods_id){
				 const {data:res}=await uni.$http.get('/api/public/v1/goods/detail',{goods_id})
				 if(res.meta.status!==200) return uni.$showMsg()
				 
				 // 调用字符串的replace方法，为img标签添加行内style样式，解决图片底部的空白间隙的问题
				 // 前面代表替换掉<img /g 代表全部替换
				 res.message.goods_introduce=res.message.goods_introduce.replace(/<img /g,'<img style="display:block;"').replace(/webp /g,'jpg')
				 this.goods_info=res.message
			},
			
			// 商品导航组件的点击事件处理函数
			onClick(e){
				if(e.content.text==='购物车'){
					// 切换到购物车页面
					uni.switchTab({
						url:'/pages/cart/cart'
					})
				}
			},
			
			preview(i){
				// uniapp自带的预览图片的方法
				uni.previewImage({
					// 预览图片的索引
					current:i,
					// 所有图片URL地址的数据
					urls:this.goods_info.pics.map(x=>x.pics_big)
				})
			},
			// 加入购物车处理函数
			buttonClick(e){
				if(e.content.text==='加入购物车'){
					
					// 组织一个商品的信息对象
					const goods={
						goods_id:this.goods_info.goods_id,
						goods_name:this.goods_info.goods_name,
						goods_price:this.goods_info.goods_price,
						goods_count:1,
						goods_small_logo:this.goods_info.goods_small_logo,
						goods_state:true
						
					}
					this.addToCart(goods)
				}
			},
			
			// 把m_cart 模块中的addToCart方法
			...mapMutations('m_cart',['addToCart'])
			
		}
	}
</script>

<style lang="scss">
	swiper{
		height: 750rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.goods-info-box{
		padding: 10px;
		padding-right: 0;
		.price{
			color: #C00000;
			font-size: 12px;
			margin: 10px 0;
			
		}
		.goods-info-body{
			display: flex;
			justify-content: space-between;
			.goods-name{
				font-size: 13px;
				padding-right: 10px;
			}
			.favi{
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}
		.yf{
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}
	.goods_nav{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.detail-container{
		padding-bottom: 50px;
	}
</style>
