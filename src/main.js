import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Global Styles
import './assets/main.css';
import './assets/animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Icon Fonts
import './assets/font-awesome.js';
import './assets/line-awesome/css/line-awesome.min.css';
import 'primeicons/primeicons.css';

// Toast Plugin
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(router);
app.use(Toast);

app.mount('#app');