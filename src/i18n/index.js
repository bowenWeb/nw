import { createI18n } from 'vue-i18n'
import en from '@/locale/en'
import zh from '@/locale/zh'

const messages = {
  en: {
    ...en
  },
  zh: {
    ...zh
  }
}
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('nw-language') || 'zh',
  messages
})

export default i18n
