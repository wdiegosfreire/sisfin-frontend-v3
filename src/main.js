/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'

// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Styles
import 'unfonts.css';

const app = createApp(App);

library.add(fas)
app.component('fa-icon', FontAwesomeIcon)

registerPlugins(app);

app.mount('#app');
