import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import 'flag-icons/css/flag-icons.min.css';
import 'cropperjs/dist/cropper.css';
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
