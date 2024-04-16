import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { components } from './Composants/index';
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';
const app = createApp(App).use(PrimeVue).use(router);
app.directive('tooltip', Tooltip);
import Toast from 'primevue/toast';
app.component('Toast', Toast);
Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
});
app.use(ToastService);
app.mount('#app');
