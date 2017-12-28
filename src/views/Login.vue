<template>
	<el-form  
			:model="loginForm"
			:rules="rules"
			ref="login"
			label-width="0px"
			class="demo-ruleForm login-container"
			label-position="left"
			>
			<h2 class="title">博客后台登录</h2>
			<el-form-item prop="account">
				<el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号">

				</el-input>
			</el-form-item>
			<el-form-item prop="password">
					<el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码">
					</el-input>
			</el-form-item>
			<el-form-item>
					<el-button type="primary" style="width:100%"  @click.native.prevent="handleSubmit" :loading="loading">
						登录
					</el-button>
			</el-form-item>
	</el-form>
</template>


<script>
import * as service from '@/services/index';
import * as api from '@/constants/api';
	export default{
		data(){
			return {
				loading:false,
				loginForm:{
					account:'',
					password:"",
				},
				rules:{
					account:[
						{required:true,message:"请输入账号",trigger:'blur'},
					],
					password:[
						{required:"true",message:"请输入密码",trigger:'blur'}
					]
				}
			}
		},
		methods:{
			handleSubmit(){
				//denglu
			
				this.$refs.login.validate((valid)=>{
					if(valid){
							this.loading=true;
						service.post(api.LOGIN,this.loginForm).then((res)=>{
								this.loading=false;
								var result=res.data;
								if(result.error==0){
									this.$message({
										type:'success',
										message:'欢迎管理员:'+result.data.nickname+ ' 回来!'
									});
									this.$store.state.admin=result.data;
									this.$router.replace("/");
								}else{
									this.$message({
										type:"error",
										message:result.msg
									})
								}
						}).catch((err)=>{
							this.$message({
								type:'error',
								message:err.message
							})
						})

					}else{
						this.$message({
							type:"error",
							message:"检查清楚再提交!"
						})
						return false;
					}
				})
			}
		}
	}
</script>


<style lang="less" scoped>
.title{
	text-align: center;
}
.login-container{
	border-radius: 8px;
	width:400px;
	margin:180px auto;	
	padding:20px;
	border:1px solid #eee;

}
</style>