import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { createPinia } from 'pinia'



const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

createApp(App).use(router).use(ElementPlus).use(pinia).mount('#app')
