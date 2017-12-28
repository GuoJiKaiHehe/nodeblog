<template>
	<section>
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="toolsForm">
				<el-form-item prop="keyword">
					<el-input placeholder="账号模糊查询" v-model="toolsForm.keyword" @keyup.enter.native="searchByKeyword"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click.native.prevent="searchByKeyword">查询</el-button>
				</el-form-item>				
			</el-form>
		</el-col>
		<el-col :span="24">
			<el-table 
					:data="list" 
					@selection-change="selectedRows"
					v-loading="fetching_data"
					style="width: 100%;"
					highlight-current-row 
					>
				<el-table-column type="selection">
				</el-table-column>
				<el-table-column type="index" sortable>
				</el-table-column>
				<el-table-column prop="account" label="账号" sortable> 
			
				</el-table-column>
				<el-table-column prop="nickname"  label="昵称" sortable>
				</el-table-column>
				<el-table-column prop="email" label="邮箱" sortable>
				</el-table-column>
				<el-table-column prop="avatar" label="头像" sortable>
					<template slot-scope="scope">
							<img :src="'/uploads/avatar/'+scope.row.avatar" width='50' height="50" alt="">
					</template>
				</el-table-column>
				<el-table-column prop="created_at" label="创建时间">
					<template slot-scope="scope">
						{{scope.row.created_at|formatDate}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template  slot-scope="scope">
						<el-button size="small" type="primary" @click="handleDetail(scope.$index,scope.row)">详细</el-button>
						<el-button size="small" @click="handleEdit(scope.$index,scope.row)">
							编辑
						</el-button>
						<el-button size="small" type="danger" @click="handleDel(scope.$index,scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar" v-if="list.length>0">
				<el-pagination
				  @size-change="handleSizeChange"
				  @current-change="handleCurrentChange"
				  :current-page="page"
				  :page-sizes="[10, 20, 30, 40]"
				  :page-size="limit"
				  layout="total, sizes, prev, pager, next, jumper"
				  :total="total">
				</el-pagination>				
			</el-col>				
		</el-col>
		
		<el-dialog 
			title="编辑管理员"
			:visible.sync="isShowEdit"
			:before-close="edit_handleBeforeClose"
			:fullscreen="false"
			:lock-scroll="true"
			:close-on-click-modal="false"
		>
			<el-form 
				ref="editForm"
				:model="editForm" 
				:rules="editRules"
				label-width="80px" 
				@submit.native.prevent="editSubmit"				
			>
					<el-form-item label="账号" prop="account">
						<el-input v-model="editForm.account" placeholder="账号" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="editForm.password" placeholder="密码"  type="password" auto-complete="off"></el-input>
					</el-form-item>		
					<el-form-item label="确认密码" prop="confirmPassword">
						<el-input v-model="editForm.confirmPassword" type="password" placeholder="确认密码" auto-complete="off"></el-input>
					</el-form-item>	
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="editForm.email" placeholder="邮箱" auto-complete="off"></el-input>
					</el-form-item>		
					<el-form-item label="手机号码" prop="phone">
						<el-input v-model="editForm.phone" placeholder="手机号码" auto-complete="off"></el-input>
					</el-form-item>				
					<el-form-item prop="sex" label="性别">
						<el-radio v-model="editForm.sex" label="1"  size="medium">
							男
						</el-radio>
						<el-radio v-model="editForm.sex" label="0" size="medium">
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
							<img v-if="editForm.avatar" :src="avatarPrefix+editForm.avatar" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>				
						</el-upload>
					</el-form-item>

					<el-form-item>
						<el-button @click.native.prevent="editSubmit" type="primary" :loading="btn_loading">
							修改
						</el-button>
					</el-form-item>					
			</el-form>
		</el-dialog>
	</section>
</template>

<script>
import * as config from '@/config';

import {
	get_manager_list,
	del_manager_by_id,
	get_manager_by_id,
} from '@/services/ManagerService';
import moment from 'moment';
function gen_edit_form(){
	return {
			_id:"",
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
		components:{
			
		},
		data(){
var validateConfirmPass=(rule,value,callback)=> {
			if(this.addForm.password!==value){
				callback(new Error("两次密码不一致"));
			}else{
				callback();
			}
		}				
			return {
				loading:null,
				upuloadPath:config.upuloadPath,
				avatarPrefix:config.avatarPrefix,
				btn_loading:false,
				isShowEdit:false,
				toolsForm:{
					keyword:"",
				},
				list:[],
				fetching_data:false,
				page:1,
				limit:10,
				total:0,
				editForm:gen_edit_form(),
				editRules:{
					account:[
						{required:true,message:'请输入账号',trigger:"blur"},
						{pattern:/^[^\s]{2,20}$/ig,message:"不得含有空格;4-20个字符",trigger:"blur"},
					],
					password:[
							{message:"请输入密码",trigger:"blur"},
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
			this.fetchData();
		},
		methods:{
			editSubmit(){

			},
			edit_handleBeforeClose(){
				this.editForm=gen_edit_form();
				this.isShowEdit=false;
			},
			searchByKeyword(){
				this.fetchData();
			},
			selectedRows(rows){
				console.log(rows);
			},
			handleEdit(index,row){
				get_manager_by_id(row._id).then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.isShowEdit=true;
						result.data.sex=String(result.data.sex);
						delete result.data.password;
						this.editForm=result.data;

						// console.log(this.editForm)
					}else{
						this.message({
							type:"error",
							message:result.msg
						})
						this.fetchData();
					}
				}).catch((err)=>{
					console.log(err);
					this.$message({type:'error',message:err.message})
				})
			},
			handleDel(index,row){
				this.$confirm("确定要删除这个管理员么").then(()=>{
					console.log(row.id);
					del_manager_by_id(row._id).then((res)=>{
						let result = res.data;
						if(result.error==0){
							this.$message({
								type:"success",
								message:'删除'+row.nickname+"成功"
							})
							this.fetchData();
						}else{
							this.$message({
								type:'error',
								message:"删除失败："+result.msg
							});
							this.fetchData();
						}
					})	

				}).catch(()=>{})
			},
			handleDetail(index,row){
				
			},
			handleSizeChange(val){
				this.limit=val;
				this.fetchData();
			},
			handleCurrentChange(page){
				this.page=page;
				this.fetchData();
			},
			fetchData(){
				let opts={
					page:this.page,
					limit:this.limit,
					keyword:this.toolsForm.keyword,
				};
				this.fetching_data=true;
				get_manager_list(opts).then((res)=>{
					let result=res.data;
					this.total=result.data.count;
					this.list=result.data.rows;
					this.fetching_data=false;
				}).catch((err)=>{
					this.$message({
						type:'error',
						message:err.message
					});
				})
			},
		handleAvatarSuccess(res, file) {
	        // this.imageUrl = URL.createObjectURL(file.raw);
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