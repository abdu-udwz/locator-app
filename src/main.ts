import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const app = createApp(App)

app.use(vuetify)
app.mount('#app')
