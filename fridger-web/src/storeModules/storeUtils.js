
/**
 * Checks if all paths are implemented
 * @param {{mutations: string[], getters: string[], actions: string[]}} paths 
 * @param {{mutations: function[], getters: function[], actions: function[]}} mod 
 */
export function checkModules(paths, mod) {
    for(let [k, v] of Object.entries(paths.actions)) {
        if(!k.startsWith('G_') && typeof(mod.actions[v]) != 'function') {
            console.error(`Action ${k} is not implemented`)
        }
    }
    for(let [k, v] of Object.entries(paths.getters)) {
        if(!k.startsWith('G_') && typeof(mod.getters[v]) != 'function') {
            console.error(`Getter ${k} is not implemented`)
        }
    }
    for(let [k, v] of Object.entries(paths.mutations)) {
        if(!k.startsWith('G_') && typeof(mod.mutations[v]) != 'function') {
            console.error(`Mutation ${k} is not implemented`)
        }
    }
}