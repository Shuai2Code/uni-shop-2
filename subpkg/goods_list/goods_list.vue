<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj:{
					query:'',
					cid:'',
					pagenum:1,
					pagesize:10
				},
				goodsList:[],
				total:0,
				isloading:false
			};
		},
		onLoad(options){
			this.queryObj.query=options.query||''
			this.queryObj.cid=options.cid||''
			// console.log(this.queryObj)
			
			// 获取商品列表数据
			this.getGoodsList()
		},
		methods:{
			 async getGoodsList(cb){
				 this.isloading=true
				 const{data:res}=await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				 this.isloading=false
				 
				 // 只要数据请求完毕，就立即按需调用cb 回调函数
				 cb && cb()
				 
				 if(res.meta.status!==200) return uni.$showMsg()
				 
				 this.goodsList=[...this.goodsList,...res.message.goods]
				 this.total=res.message.total
				 
			},
			// 跳转到商品详情页面
			gotoDetail(goods){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id='+goods.goods_id
				})
			}
		},
		// 触底事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total) return uni.$showMsg('数据加载完毕！')
			// 判断节流阀
			if(this.isloading) return
			// 页码值自增加1
			this.queryObj.pagenum+=1
			// 重新获得列表数据
			this.getGoodsList()
		},
		onPullDownRefresh() {
			this.queryObj.pagenum=1
			this.total=0
			this.isloading=false
			this.goodsList=[]
			
			// 重新发起请求
			this.getGoodsList(()=>uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
	
</style>
