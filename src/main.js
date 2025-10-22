import { createApp } from 'vue';
import App from './App.vue';

import VueSimpleAlert from 'vue3-simple-alert';
import 'sweetalert2/dist/sweetalert2.min.css';

import { registerPlugins } from '@/plugins';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { MaskInput } from 'vue-3-mask';

import 'unfonts.css';

const app = createApp(App);

app.config.globalProperties.$vueAlert = VueSimpleAlert;

app.use(VueSimpleAlert)

library.add(fas)
app.component('fa-icon', FontAwesomeIcon);
app.component('MaskInput', MaskInput);

registerPlugins(app);
app.mount('#app');
