import { createApp } from 'vue'
import App from './App.vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import VueClickAway from "vue3-click-away";

const app = createApp(App)
app.use(BootstrapVue3)
app.use(VueClickAway)
app.mount('#app')
