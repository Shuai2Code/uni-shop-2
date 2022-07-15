// 导入Vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'

// 导入购物车的vuex 模块
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

// 将VueX安装为Vue的插件
Vue.use(Vuex)


// 创建Store的实例对象
const store =new Vuex.Store({
	// TODO：挂载store模块
	modules:{
		// 挂载购物车的vuex模块，模块内成员的访问路径被调整为m_cart
		'm_cart':moduleCart,
		'm_user':moduleUser
	}
})

export default store