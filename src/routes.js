import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Login from '@/views/Login';

import Home from '@/views/Home';
import Welcome from '@/views/Home/Welcome';

import ManagerIndex from '@/views/Home/Manager';
// import ManagerList from '@/views/Home/Manager/list';
// import ManagerAdd from '@/views/Home/Manager/add';

import BlogIndex from '@/views/Home/Blog/index';
// import BlogList from '@/views/Home/Blog/list';

import CateIndex from '@/views/Home/Cate/index';
import TagIndex from '@/views/Home/Tag/index';
// import CateList from '@/views/Home/Cate/list';
export default new Router({
	routes:[
		{path:"/login",component:Login,meta:{requireAuth:false}},
		{
			path:"/",
			component:Home,
			name:"首页",
			children:[
				{path:"/",component:Welcome,name:"欢迎页"},
				{path:"/manager",component:ManagerIndex,name:"管理员管理"},
				{path:"/blog",component:BlogIndex,name:"博文管理"},
				{path:"/cate",component:CateIndex,name:"栏目列表"},
				{path:"/tag",component:TagIndex,name:"标签列表"}
						
			]
		}
	]
})