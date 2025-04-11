import './styles/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupI18n } from './i18n'
import bemMixin from './mixins/bem'

async function bootstrap() {
    const app = createApp(App)
    const i18n = await setupI18n()

    app.mixin(bemMixin).use(i18n).use(router).mount('#app')
}

bootstrap()
