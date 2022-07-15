<template>
	
		<view class="goods-item">
			<!-- 左侧盒子 -->
			<view class="goods-item-left">
				<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler" ></radio>
				<image :src="goods.goods_small_logo ||defaultPic" class="goods-pic"></image>
			</view>
			<!-- 右侧盒子 -->
			<view class="goods-item-right">
				<view class="goods-name">{{goods.goods_name}}</view>
				<view class="goods-info-box">
					<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
					<!-- 商品数量 -->
					<uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler" ></uni-number-box>
				</view>
				
			</view>
			
		</view>	
	
</template>

<script>
	export default {
		name:"my-goods",
		props:{
			goods:{
				type:Object,
				default:{}
			},
			
			// 是否显示购物车图片左侧的radio
			showRadio:{
				type:Boolean,
				default:false
			},
			//是否显示右侧的NumberBox组件
			showNum:{
				type:Boolean,
				default:false
			}
		},
		
		
		data() {
			return {
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				// mygoods_state:this.goods_state
			}
		},
		filters:{
			tofixed(num){
				 return Number(num).toFixed(2)
			}
		},
		methods:{
			radioClickHandler(){
				// 把商品的id和勾选状态作为参数传递给radio-change事件
				this.$emit('radio-change',{
					goods_id:this.goods.goods_id,
					// 商品的最新勾选状态
					goods_state: ! this.goods.goods_state
				})
			},
			numChangeHandler(val){
				// 通过$emit()触发外界通过@绑定的num-change 事件
				this.$emit('num-change',{
					goods_id:this.goods.goods_id,
					// 商品的最新数量 +可以转为0
					goods_count:+val
				})
			}
		}
	}
</script>

<style lang="scss">
.goods-item{
	width: 750rpx;
	box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		.goods-item-left{
			margin-right: 5px;
			// 为内部的radio添加样式
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.goods-pic{
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		.goods-item-right{
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;
			.goods-name{
				font-size: 13px;
			}
			.goods-info-box{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.goods-price{
					color: #C00000;
					font-size: 16px;
				}
			}
		}
	}
</style>