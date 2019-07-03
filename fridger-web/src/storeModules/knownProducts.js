export default  {
    namespaced: true,
    state: {
        productList: []
    },
    getters: {
        getByName: (state) => (name) => {
            return state.productList.find(e => e.name == name)
        } 
    }
}