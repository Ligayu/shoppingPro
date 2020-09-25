import Vue from 'vue'
import App from './App'
import utilsRequest from "./utils/request";

Vue.config.productionTip = false

// 将我们自己的方法 挂载到Vue的原型上了
// 可以确保 this 是 Vue的实例 所以  this.request

// config.data 挂载到 this 上的需求 


// Vue.prototype.request=utilsRequest.request;
// Vue.prototype.requestAll=utilsRequest.requestAll;

Object.keys(utilsRequest).forEach(key => Vue.prototype[key] = utilsRequest[key]);



App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
