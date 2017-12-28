<template>
	<aside :class="collapse?'menu-collapsed':'menu-expanded'">
		<el-menu :default-active="$route.path"
				 class="el-menu-vertical-demo"
				 @open="handleopen"
				 @close="handleclose"
				 @select="handleselect"
				 unique-opened
				 router
				 :collapse="collapse"
				>
				<el-menu-item index="/">
					<i class="fa fa-home fa-fw"></i>
					<span slot="title">首页</span>
				</el-menu-item>
				<el-submenu index="/manager">
					<template slot="title">
						<i class="fa fa-user"></i>
						<span slot="title">管理员管理</span>
					 </template>
					 <el-menu-item index="/manager">管理员列表</el-menu-item>
				</el-submenu>
				<el-submenu index="/blog">
					<template slot="title">
						<i class="fa fa-user"></i>
						<span slot="title">博文管理</span>
					 </template>
					 <el-menu-item index="/blog">博文列表</el-menu-item>
					 <el-menu-item index="/comments">留言列表</el-menu-item>
					 <el-menu-item index="/cate">博文栏目</el-menu-item>
					 <el-menu-item index="/tag">博文标签</el-menu-item>
					 <el-menu-item index="/comments">游客管理</el-menu-item>
				</el-submenu>
				<el-submenu index="/statistics">
					<template slot="title">
						<i class="fa fa-user"></i>
						<span slot="title">统计管理</span>
					 </template>			
					 <el-menu-item index="/pv">网站访问量</el-menu-item>		
					 <el-menu-item index="/vistor">游客注册量</el-menu-item>
				</el-submenu>
				<!-- 
				<el-submenu index="/store">
				    <template slot="title">
				      <i class="el-icon-location"></i>
				      <span slot="title">门店管理</span>
				    </template>
				   <el-menu-item index="/store">门店列表</el-menu-item>
			  </el-submenu>

			  <el-submenu index="/employee">
					<template slot="title">
						<i class="fa fa-user fa-fw"></i>
						<span slot="title">员工管理</span>
					</template>
					<el-menu-item-group>
					<el-menu-item index="/employee">员工列表</el-menu-item>
					<el-menu-item index="/position">员工职位</el-menu-item>
					<el-menu-item index="/role">员工角色</el-menu-item>
					</el-menu-item-group>
			  </el-submenu>
			  <el-submenu index="/user">
					<template slot="title">
						<i class="fa fa-user"></i>
					 	<span slot="title">会员管理</span>						
					</template>

					<el-menu-item index="/user">
						会员列表
					</el-menu-item>
					<el-menu-item index="/level">
						会员等级
					</el-menu-item>
			  </el-submenu> -->
			  

			  <el-menu-item index="3">
			    <i class="el-icon-setting"></i>
			    <span slot="title">设置</span>
			  </el-menu-item>
		</el-menu>
	</aside>
</template>

<script>
	export default {
		props:{
			collapse:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{

			}
		},
		methods:{
			handleopen(){

			},
			handleclose(){

			},
			handleselect(){

			}
		},

	}
</script>
<style lang="less">
	.menu-expanded{
		
	}
	.el-menu-vertical-demo{
		height: 100%;
	}
	
</style>