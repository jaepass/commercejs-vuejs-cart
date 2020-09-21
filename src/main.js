import Vue from 'vue';
import App from './App.vue';
import './assets/css/tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Commerce from '@chec/commerce.js';;

const commerce = (typeof process.env.VUE_APP_CHEC_PUBLIC_KEY !== 'undefined')
  ? new Commerce(process.env.VUE_APP_CHEC_PUBLIC_KEY)
  : null;

Vue.mixin({
  beforeCreate() {
    this.$commerce = commerce
  }
});

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
