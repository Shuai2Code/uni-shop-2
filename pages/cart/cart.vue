<template>
	<view class="cart-container" v-if="cart.length!==0">
		
		<!-- 收货地址组件 -->
		<my-address></my-address>
		
		<!-- 购物车的商品标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		
		
		<uni-swipe-action>
			<!-- 商品列表区域 -->
			<block v-for="(goods,i) in cart" :key="i">
			 <uni-swipe-action-item :right-options="options" @click="swiperItemClickHandler(goods)">
				 <!-- 声明props时采用驼峰命名法，而在使用时短线连接 -->
				 <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler" ></my-goods>
			 </uni-swipe-action-item>
			</block>
		</uni-swipe-action>	
		
		<!-- 使用自定义的组件 -->
		<my-settle></my-settle>
		
		
	</view>
	
	<!-- 空白购物车 -->
	<view class="empty-cart" v-else>
		<image src="../../static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	// 导入自己封装的mixin模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	
	// 按需导入mapState这个辅助函数
	import {mapState,mapMutations} from 'vuex'
	
	export default {
		// 使用badgeMix 模块
		mixins:[badgeMix],
		computed:{
			// 将m_cart 中cart的数组映射到当前页面显示
			...mapState('m_cart',['cart'])
		},
		data() {
			return {
				options:[{
					text:'删除',
					style:{
						backgroundColor:'#C00000'
					}
				}]
			};
		},
		
		methods:{
			...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
			// 商品勾选状态发生了变化
			radioChangeHandler(e){
				this.updateGoodsState(e)
				// console.log(e)
			},
			numberChangeHandler(e){
				this.updateGoodsCount(e)
				// console.log(e)
			},
			swiperItemClickHandler(goods){
				this.removeGoodsById(goods.goods_id)
			}
		}
		
	}
</script>

<style lang="scss">
	.cart-container{
		padding-bottom: 50px;
	}
	.cart-title{
		height: 40px;
		display: flex;
		align-items: center;
		
		padding-left: 5px;
		border-bottom: 1px solid #efefef;
		
		.cart-title-text{
			font-size: 14px;
			margin-left: 10px;
		}
	}
	.empty-cart{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;
		.empty-img{
			width: 90px;
			height: 90px;
		}
		.tip-text{
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}
</style>
