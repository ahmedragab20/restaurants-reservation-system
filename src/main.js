import Vue from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";
import "../axios.config";
import "bootstrap-icons/font/bootstrap-icons.css";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
