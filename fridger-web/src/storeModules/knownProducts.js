import {ProductTemplate} from '../classes/Products'

export default  {
    namespaced: true,
    state: {
        productList: []
    },
    getters: {
        getByName: (state) => (name) => {
            return state.productList.find(e => e.name == name)
        },
        getByBarCode: (state) => (code) => {
            return state.productList.find(e => e.barCode == code)
        },
    },
    mutations: {
        fillDemo(state) {
            state.productList.push(new ProductTemplate('Müsli Vitali Feinherb',  '000001'))
            state.productList.push(new ProductTemplate('Müsli Vitali Vollmilch', '000002'))
        }
    }
}