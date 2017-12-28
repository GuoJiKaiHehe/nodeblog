<template>
	<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">
		<el-form-item label="账号" prop="account">
			<el-input v-model="addForm.account" placeholder="账号" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input v-model="addForm.password" placeholder="密码"  type="password" auto-complete="off"></el-input>
		</el-form-item>		
		<el-form-item label="确认密码" prop="confirmPassword">
			<el-input v-model="addForm.confirmPassword" type="password" placeholder="确认密码" auto-complete="off"></el-input>
		</el-form-item>	
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="addForm.email" placeholder="邮箱" auto-complete="off"></el-input>
		</el-form-item>		
		<el-form-item label="手机号码" prop="phone">
			<el-input v-model="addForm.phone" placeholder="手机号码" auto-complete="off"></el-input>
		</el-form-item>				
		<el-form-item prop="sex" label="性别">
			<el-radio v-model="addForm.sex" label="1"  size="medium">
				男
			</el-radio>
			<el-radio v-model="addForm.sex" label="0" size="medium">
				女
			</el-radio>
		</el-form-item>
		<el-form-item>
			<el-upload 
				:action="upuloadPath"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload"
				name="avatar"
				class="avatar-uploader"
			>
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>				
			</el-upload>
		</el-form-item>

		<el-form-item>
			<el-button @click.native.prevent="addSubmit" type="primary" :loading="btn_loading">
				添加
			</el-button>
		</el-form-item>			
	</el-form>
</template>

<script>
import {
	add_manager
} from '@/services/ManagerService';
import * as config from '@/config';

function get_add_form(){
	return {
			account:"",
			password:"",
			confirmPassword:"",
			email:"",
			avatar:"",
			phone:"",
			sex:"1",

		}		
}
export default{
	data(){
		var validateConfirmPass=(rule,value,callback)=> {
			if(this.addForm.password!==value){
				callback(new Error("两次密码不一致"));
			}else{
				callback();
			}
		}	

		return {
			upuloadPath:config.upuloadPath,
			avatarPrefix:config.avatarPrefix,
			imageUrl:'',
			addForm:get_add_form(),
			loading:null,
			btn_loading:false,
			addFormRules:{
				account:[
					{required:true,message:'请输入账号',trigger:"blur"},
					{pattern:/^[^\s]{2,20}$/ig,message:"不得含有空格;4-20个字符",trigger:"blur"},
				],
				password:[
						{required:true,message:"请输入密码",trigger:"blur"},
						{pattern:/^[^\s]{6,20}$/ig,message:"不得含有空格;6-20个字符",trigger:"blur"},					
				],
				confirmPassword:[
					{validator:validateConfirmPass,trigger:'blur'}
				],		
				email:[
					{type:'email',required:true,message:"请输入正确邮箱",trigger:"blur"}
				],
				phone:[
					{required:false,message:"请输入正确电话号码",len:11,trigger:"blur"}
				],
				avatar:[
					{type:"string"}
				],

			}
		}	
	},
	mounted(){
		console.log("add");
	},
	methods:{
		addSubmit(){
			this.$refs.addForm.validate((valid)=>{
				if(valid){
					this.btn_loading=true;
					add_manager(this.addForm).then((res)=>{
						this.btn_loading=false;
						// console.log(res);
						let result = res.data;
						if(result.error==0){
						
							this.$message({
								type:"success",
								message:result.msg
							})
							this.addForm=get_add_form();
							this.imageUrl='';
						}else{
							this.$message({
								type:"error",
								message:result.msg
							});
						}
					}).catch((err)=>{
						this.$message({
							type:"error",
							message:err.message
						})
					})
				}else{
					this.$message({
						type:'error',
						message:"检查清楚再提交"
					})
				}
			})
		},
handleAvatarSuccess(res, file) {
	        this.imageUrl = URL.createObjectURL(file.raw);
			console.log(res);
			this.addForm.avatar=res.data.true_name;
			this.loading.close();
			if(res.error==0){
				this.$message({
					type:"success",
					message:"上传成功"
				});
			}else{
				this.$message({
					type:"error",
					message:res.msg
				})
			}
	    },	

	    beforeAvatarUpload(file) {
	        const isIMG = file.type === 'image/jpeg' ||
	        		 	  file.type === 'image/jpg' || 
	        		 	  file.type === 'image/png';
	        const isLt2M = file.size / 1024 / 1024 < 2;

	        if (!isIMG) {
	          this.$message.error('上传头像图片只能是 IMG 格式!');
	        }
	        if (!isLt2M) {
	          this.$message.error('上传头像图片大小不能超过 2MB!');
	        }
	       var  istrue=isIMG && isLt2M;
	        if(istrue){
				this.loading=this.$loading({
					lock:true,
					text:"正在上传照片",
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.3)'
				});		        	
	        }
	        return istrue
	    },		
			
	}
}
	
</script>

<style scoped>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }	
</style>