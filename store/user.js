export default{
	namespaced:true,
	
	// 数据
	state:()=>({
		address:JSON.parse(uni.getStorageSync('address')||'{}'),
		token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo',
		// uni.getStorageSync('token')||'' ,
		// 用户的信息对象
		userinfo:JSON.parse(uni.getStorageSync('userinfo')||'{}'),
		// 重定向的object对象
		redirectInfo:null
	}),
	
	// 方法
	mutations:{
		// 更新收货地址
		updateAddress(state,address){
			state.address=address
			this.commit('m_user/saveAddressToStorage')
		},
		// 持久化存储本地
		saveAddressToStorage(state){
			uni.setStorageSync('address',JSON.stringify(state.address))
		},
		updateUserInfo(state,userinfo){
			state.userinfo = userinfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		saveUserInfoToStorage(state){
			uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
		},
		
		// 存储token
		updateToken(state,token){
			state.token=token 
			this.commit('m_user/saveTokenToStorage')
		},
		saveTokenToStorage(state){
			uni.setStorageSync('token',state.token)
		},
		
		updateRedirectInfo(state,info){
			state.redirectInfo=info
			// console.log(state.redirectInfo)
		}
		
	},
	
	// 修改数据
	getters:{
		// 抽离出的收货地址
		addstr(state){
				if(!state.address.provinceName) return ''
					return state.address.provinceName+state.address.cityName+state.address.countyName+state.address.detailInfo
			}
		}
}