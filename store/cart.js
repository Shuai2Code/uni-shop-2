export default {
	// 为当前模块开启命名空间
	namespaced:true,
	
	// 模块的state 数据
	state:()=>({
		// 购物车的数据，用来存放每个商品的信息对象
		// 每个商品都有6个属性
		cart: JSON.parse(uni.getStorageSync('cart')||'[]') 
	}),
	
	// 模块的mutation方法，用于修改state中的数据
	mutations:{
		addToCart(state,goods){
			// 既然要添加，就要先判断是否已经存在于购物车中
			const findResult=state.cart.find((x)=>x.goods_id===goods.goods_id)
			
			// 如果不存在，则直接push进购物车
			if(!findResult){
				state.cart.push(goods)
			} else {
				// 已经存在于购物车之中，则数量加1
				findResult.goods_count++
			}
			
			// 通过commit方法，调用m_cart 命名空间下的saveToStorage方法
			this.commit('m_cart/saveToStorage')
		},
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		// 更新购物车中的商品勾选状态
		updateGoodsState(state,goods){
			// 根据goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			// 有对应的商品信息
			if(findResult){
				// 更新对应商品的勾选状态
				findResult.goods_state=goods.goods_state
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新商品数量
		updateGoodsCount(state,goods){
			 const findResult= state.cart.find(x=>x.goods_id===goods.goods_id)
			 if(findResult){
				 findResult.goods_count=goods.goods_count
				 this.commit('m_cart/saveToStorage')
			 }
		},
		removeGoodsById(state,goods_id){
			// 根据id删除对应的商品
			 state.cart= state.cart.filter(x=>x.goods_id!==goods_id)
			 this.commit('m_cart/saveToStorage')
		},
		
		// 更新购物车中所有商品的勾选状态
		updateAllGoodsState(state,newState){
			state.cart.forEach(x=>x.goods_state=newState)
			this.commit('m_cart/saveToStorage')
		}
	},
	
	// 模块的getters属性
	getters:{
		// 统计购物车中商品的总数量
		total(state){
			// let c=0
			// // 循环累加
			// state.cart.forEach(goods=>c+=goods.goods_count)
			// return c
			// 利用数组的reduce方法，循环累加商品总数,第二个参数是0，代表的是total初始值是0
			 return state.cart.reduce((total,item)=>total+=item.goods_count,0)
		},
		
		// 动态计算购物车的结算
		checkedCount(state){
			 return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total+=item.goods_count,0)
		},
		
		// 已勾选商品的总价格
		checkedGoodsAmount(state){
			 return state.cart.filter(x=>x.goods_state).reduce((total,item)=>total+=item.goods_count*item.goods_price,0).toFixed(2)
		}
		
		
	}
	
}