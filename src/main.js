import {createApp} from 'vue'
import App from './App.vue'
// import '@varlet/ui/es/style'
import '@varlet/touch-emulator'
import '@varlet/ui/es/action-sheet/style/index'
import './style.css'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {createI18nInstance} from './lang/index'
import {useThemeStore} from "./store/theme.js";

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)

pinia.use(piniaPluginPersistedstate)
const store = useThemeStore(pinia);
const vuei18n = createI18nInstance(store.language);

app.use(vuei18n)
app.mount('#zihao_il')
