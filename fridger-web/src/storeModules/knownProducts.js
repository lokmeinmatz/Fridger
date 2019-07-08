import {ProductTemplate} from '../classes/Products'

export const knownProductsPaths = {
    mutations: {
        FILL_DEMO: 'fillDemo',
        G_FILL_DEMO: 'knownProducts/fillDemo',
        
        INSERT_FOOD_CHECKED: 'insertFoodChecked',
        G_INSERT_FOOD_CHECKED: 'knownProducts/insertFoodChecked'
    },
    getters: {
        GET_BY_NAME: 'getByName',
        G_GET_BY_NAME: 'knownProducts/getByName',

        GET_BY_BARCODE: 'getByBarCode',
        G_GET_BY_BARCODE: 'knownProducts/getByBarCode',

        FOOD_EXISTS: 'foodExists',
        G_FOOD_EXISTS: 'knownProducts/foodExists',
    },
    actions: {
        ADD_NEW_FOOD: 'addNewFood',
        G_ADD_NEW_FOOD: 'knownProducts/addNewFood',
    }
}


export const modKnownProducts = {
    namespaced: true,
    state: {
        productList: []
    },
    getters: {
        [knownProductsPaths.getters.GET_BY_NAME]: (state) => (name) => {
            return state.productList.find(e => e.productName == name)
        },
        [knownProductsPaths.getters.GET_BY_BARCODE]: (state) => (code) => {
            return state.productList.find(e => e.barCode == code)
        },
        [knownProductsPaths.getters.FOOD_EXISTS]: (state) => (name, code) => {
            return state.productList.some(t => t.barCode == code || t.productName == name)
        }
    },
    mutations: {
        // fillDemo
        [knownProductsPaths.mutations.FILL_DEMO](state) {
            state.productList = []
            state.productList.push(new ProductTemplate('Müsli Vitali Feinherb',  '000001'))
            state.productList.push(new ProductTemplate('Müsli Vitali Vollmilch', '000002'))
        },
        [knownProductsPaths.mutations.INSERT_FOOD_CHECKED](state, item) {
            state.productList.push(item)
        }
    },
    actions: {
        [knownProductsPaths.actions.ADD_NEW_FOOD]({commit, getters}, item) {
            return new Promise((resolve, reject) => {
                if(!(item instanceof ProductTemplate) || getters.foodExists(item.productName, item.barCode)) {
                    return reject()
                }
                commit(knownProductsPaths.mutations.INSERT_FOOD_CHECKED, item)
                resolve()
            })
            
        }
    }
}