import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { store } from './store'
import './assets/style/media.css'
import './assets/style/font.css'
import './assets/style/var.css'
import './assets/style/reset.scss'
import './assets/style/common.scss'
import i18n from './i18n'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn
})
app.use(store)
app.use(router)
app.use(i18n)
app.mount('#app')
