import {ProductTemplate, ProductInstance } from '../classes/Products'
import {knownProductsPaths} from './knownProducts'

export const storedProductsPaths = {
    mutations: {
        INSERT_FOOD_CHECKED: 'insertFoodChecked',
        G_INSERT_FOOD_CHECKED: 'storedProducts/insertFoodChecked'
    },
    getters: {
        GET_NEXT_IID: 'getNextInstanceID',
        G_GET_NEXT_IID: 'storedProducts/getNextInstanceID',
    },
    actions: {
        FILL_DEMO: 'fillDemo',
        G_FILL_DEMO: 'storedProducts/fillDemo',

        ADD_NEW_FOOD: 'addNewFood',
        G_ADD_NEW_FOOD: 'storedProducts/addNewFood',
    }
}


export const modStoredProducts = {
    namespaced: true,
    state: {
        productStore: []
    },
    getters: {
        [storedProductsPaths.getters.GET_NEXT_IID](state) {
            return state.productStore.reduce((acc, curr) => {
                if(acc > curr.instanceID) return acc
                return curr.instanceID + 1
            }, 0)
        }
    },
    mutations: {
        [storedProductsPaths.mutations.INSERT_FOOD_CHECKED](state, item) {
            state.productStore.push(item)
        }
    },
    actions: {
        // fillDemo
        [storedProductsPaths.mutations.FILL_DEMO]({state, rootGetters}) {

            const msli1 = rootGetters[knownProductsPaths.getters.G_GET_BY_BARCODE]('000001')
            const msli2 = rootGetters[knownProductsPaths.getters.G_GET_BY_BARCODE]('000002')

            state.productStore.push(new ProductInstance(msli1,  1, '2019-07-06'))
            state.productStore.push(new ProductInstance(msli1, 2, '2019-07-22'))
            state.productStore.push(new ProductInstance(msli2, 3, '2019-07-09'))
        },
        [storedProductsPaths.actions.ADD_NEW_FOOD]({commit, state}, item) {
            return new Promise((resolve, reject) => {
                if(!(item instanceof ProductInstance) || state.productStore.some(i => i.instanceID == item.instanceID)) {
                    return reject()
                }
                commit(storedProductsPaths.mutations.INSERT_FOOD_CHECKED, item)
                resolve()
            })
            
        }
    }
}