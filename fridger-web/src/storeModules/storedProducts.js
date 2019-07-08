import { ProductInstance } from '../classes/Products'
import {knownProductsPaths} from './knownProducts'
import { checkModules } from './storeUtils'

export const storedProductsPaths = {
    mutations: {
        INSERT_FOOD_CHECKED: 'insertFoodChecked',
        G_INSERT_FOOD_CHECKED: 'storedProducts/insertFoodChecked',

        REMOVE_FOOD: 'removeFood',

        OPENED_ITEM: 'openedItem',
        G_OPENED_ITEM: 'storedProducts/openedItem',
    },
    getters: {
        GET_NEXT_IID: 'getNextInstanceID',
        G_GET_NEXT_IID: 'storedProducts/getNextInstanceID',
    },
    actions: {
        ADD_NEW_FOOD: 'addNewFood',
        G_ADD_NEW_FOOD: 'storedProducts/addNewFood',

        FILL_DEMO: 'fillDemo',
        G_FILL_DEMO: 'storedProducts/fillDemo',
        
        REMOVE_FOOD: 'removeFood',
        G_REMOVE_FOOD: 'storedProducts/removeFood',
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
        },
        [storedProductsPaths.mutations.REMOVE_FOOD](state, item) {
            const i = state.productStore.indexOf(item)
            if(i != undefined) state.productStore.splice(i, 1)
        },
        [storedProductsPaths.mutations.OPENED_ITEM](state, item) {
            /**
             * @type {ProductInstance}
             */
            const itm = state.productStore.find(e => e == item)
            if (itm != undefined) itm.openSince = new Date().toISOString().substr(0, 10)
        }
    },
    actions: {
        [storedProductsPaths.actions.ADD_NEW_FOOD]({commit, state}, item) {
            return new Promise((resolve, reject) => {
                if(!(item instanceof ProductInstance) || state.productStore.some(i => i.instanceID == item.instanceID)) {
                    return reject()
                }
                commit(storedProductsPaths.mutations.INSERT_FOOD_CHECKED, item)
                resolve()
            })
            
        },
        // fillDemo
        [storedProductsPaths.actions.FILL_DEMO]({state, rootGetters}) {

            const msli1 = rootGetters[knownProductsPaths.getters.G_GET_BY_BARCODE]('000001')
            const msli2 = rootGetters[knownProductsPaths.getters.G_GET_BY_BARCODE]('000002')

            state.productStore.push(new ProductInstance(msli1,  1, '2019-07-06', undefined))
            state.productStore.push(new ProductInstance(msli1, 2, '2019-07-22', undefined))
            state.productStore.push(new ProductInstance(msli2, 3, '2019-07-09', '2019-07-05'))
            state.productStore.push(new ProductInstance(msli2, 3, '2019-07-04', '2019-07-03'))
        },
        [storedProductsPaths.actions.REMOVE_FOOD]({commit}, item) {
            commit(storedProductsPaths.mutations.REMOVE_FOOD, item)
        }
    }
}

checkModules(storedProductsPaths, modStoredProducts)