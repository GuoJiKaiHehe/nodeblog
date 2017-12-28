<template>
	<el-row class="container">
		<my-header :collapse="collapse" :logout="logout" :handlecollapse="handlecollapse"></my-header>
		<el-col :span="24" class="main">
			<side-bar :collapse="collapse"> 
			</side-bar>

			<section class="content-container">
				<el-row>
					<el-col :span="24" class="breadcrumb-container">
						<el-breadcrumb separator="/">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
									{{item.name}}
							</el-breadcrumb-item>
														
						</el-breadcrumb>
					</el-col>	
					<el-col :span="24" class="content-wrapper">
						<el-card>

						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
						</el-card>
					</el-col>				
				</el-row>	
			</section>		
		</el-col>
	</el-row>
</template>

<script>
	import SideBar from '@/components/SideBar';
	import MyHeader from '@/components/MyHeader';
	export default{
		components:{
			SideBar,
			MyHeader
		},
		data(){
			return {
				collapse:false,
				sysUserAvatar:''
			}
		},
		mounted(){
			console.log(this.$route.matched)
		},
		methods:{
			handlecollapse(){
				this.collapse=!this.collapse;
			},
			logout(){
				
			}
		}
	}
</script>


<style lang="less" scoped>
@import url('../../assets/less/_vars');
	.container{
		position: absolute;
		top:0px;
		bottom:0px;
		width:100%;
		.header{
			height: 60px;
			line-height: 60px;
			background: @primary;
			text-align: left;
			.logo-width{
				width:230px;
			}
			.logo{
				text-align: center;
			}
			.userinfo{
				text-align: right;
				padding-right: 30px;
			}
			.logo-collapse-width{
				width:65px;
				padding-left:20px;
			}
		}
		.main{
			display: flex;
			position: absolute;
			top:60px;
			bottom: 0;
			overflow: hidden;
			text-align: left;
			
			aside{
				flex:0 0 230px;
				width:230px;
				height: 100%;
			}
			.el-menu{
				
				text-align: left;
			}
			.content-container{
				flex:1;
				padding:20px;
				overflow-y:scroll;
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}	
			.breadcrumb-container{
				height: 40px;
				line-height: 40px
			}		
			.content-wrapper{
				background: #fff
			}
		}
	}
</style>