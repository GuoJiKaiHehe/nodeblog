<template>
		<el-col :span="24" class="header">
			<el-col :span="4" class="logo"  :class="collapse?'logo-collapse-width':'logo-width'">
				{{collapse?'&nbsp;':'logo'}}
			</el-col>			
			<el-col :span="10">
				<div class="tools" @click.prevent="handlecollapse">
					<i class="fa fa-align-justify" style="font-size:30px;color:#fff"></i>
				</div>
			</el-col>	
			
			<el-dropdown trigger="hover" style="float:right;padding-right:20px">
				<span class="el-dropdown-link userinfo-inner"><img :src="sysUserAvatar" /> {{$store.state.admin.account}}</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>我的消息</el-dropdown-item>
					<el-dropdown-item>设置</el-dropdown-item>
					<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
					
		</el-col>	
</template>

<script>
	export default{
		props:{
			collapse:{
				type:Boolean,
			},
			logout:{
				type:Function
			},
			handlecollapse:{
				type:Function
			}
		},
		data(){
			return {
				sysUserAvatar:''
			}
		}
	}
</script>