// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './routes'
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import moment from 'moment';
import * as service from '@/services/index';
import * as api from '@/constants/api';
Vue.config.productionTip = false
Vue.use(ElementUI);

router.beforeEach((to,from,next)=>{
	// console.log('beforeEach');
	if(to.path=='/login'){
		// sessionStorage.
		return next();
	}

	var admin=store.state.admin;
	if(!admin.nickname){
		//尝试根据cookie登录；
		service.post(api.LOGIN_BY_COOKIE).then((res)=>{
				var result=res.data;
				if(result.error==0){
					store.state.admin=result.data;
					next();
				}else{
					return next({path:'/login',redirect:to.path});
				}
		}).catch((err)=>{
			return next({path:'/login',redirect:to.path});
		})
	}
	// store.state.admin=JSON.parse(admin);
	next();
});
Vue.filter("formatDate",function(val){
	return moment(val).format("YYYY-MM-DD hh-mm-ss");
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
