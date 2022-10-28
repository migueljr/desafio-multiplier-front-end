import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want, 
// but it's best to use the name of the store and surround it with `use` 
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const usePokedexStore = defineStore('usePokedexStore', {
    state: () => ({ 
        list:[]    
    }),
    getters: {

    },
    actions: {
      add(item) {
        if(!this.list.filter(it=>it.name==item.name).length){
            this.list.push(item)
        }else{
            let result = this.list.map((it, idx)=>{
                if(it.name==item.name) return idx
            })

            this.list.splice(result[0], 1)
        }
      },
    },
    persist: true,
})