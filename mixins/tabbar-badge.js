	import {mapGetters} from 'vuex'
	
	// 导出一个mixin对象
	export default {
		computed:{
			...mapGetters('m_cart',['total'])
		},
		onShow() {
			// 页面一加载完成就显示购物车的数量数字
			this.setBadge()
		},
		watch:{
			total:{
				handler(newVal){
					this.setBadge()
				},
				immediate:true
			}
		},
		methods:{
			setBadge(){
				// 调用uni.setbadge方法设置徽标
				uni.setTabBarBadge({
					index:2,
					// 强制转为字符串
					text:this.total+''
				})
			}
	},
}