import {createApp} from 'vue'
import App from './App.vue'
// import '@varlet/ui/es/style'
import '@varlet/touch-emulator'
import '@varlet/ui/es/action-sheet/style/index'
import './style.css'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).mount('#zihao_il')
