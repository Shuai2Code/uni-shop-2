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
	export default {
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
			}
			
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
