import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import './style.less'

createApp(App).use(store).use(router).mount('#app')
