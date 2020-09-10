import Vue from 'vue';
import App from './App.vue';

import './assets/css/tailwind.css';

import Commerce from '@chec/commerce.js';

// Initialize store with public key, store key in variable
const commerce = (typeof process.env.VUE_APP_CHEC_PUBLIC_KEY !== 'undefined')
  ? new Commerce(process.env.VUE_APP_CHEC_PUBLIC_KEY, true)
  : null;

Vue.config.productionTip = false

new Vue({
  render: h => h(App,
    { props: { commerce } }),
}).$mount('#app');
