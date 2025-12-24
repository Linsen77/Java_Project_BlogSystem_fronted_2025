import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@/assets/styles/morandi.css'
import vuetify from './plugins/vuetify'

// Markdown 编辑器
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'


const app = createApp(App)

app.use(vuetify)
app.component('MdEditor', MdEditor)
app.component('MdPreview', MdPreview)
app.use(createPinia())
app.use(router)
app.mount('#app')

import useUserStore from '@/store/user'
window.userStore = useUserStore()
