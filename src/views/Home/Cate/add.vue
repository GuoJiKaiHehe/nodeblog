<template>
	<section>
		<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">
			<el-form-item label="栏目名称" prop="cateName">
				<el-input v-model="addForm.cateName" placeholder="栏目名称"  auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="父级栏目" prop="pid">
				<el-select v-model="addForm.pid" clearable placeholder="请选择">
				    <el-option
				      v-for="item in cates"
				      :key="item._id"
				      :label="item.cateName"
				      :value="item._id">
				    </el-option>
				  </el-select>
			</el-form-item>
			<el-form-item label="是否火热" prop="isHot">
							<el-switch
							  v-model="addForm.isHot"
							  active-color="#13ce66"
							  inactive-color="#ccc">
							</el-switch>
			</el-form-item>
			
		<el-form-item>
			<el-button @click.native.prevent="addSubmit" type="primary" :loading="btn_loading">
				添加
			</el-button>
		</el-form-item>			
	</el-form>
	</section>
</template>

<script>

import {
	add_cate,
	get_cate_list
} from '@/services/CateService';
function gen_add_form(){
	return {
		cateName:"",
		pid:"",
		isHot:false
	}
}
	export default{
		data(){
			return {
				btn_loading:false,
				addForm:gen_add_form(),
				addFormRules:{
					cateName:[
						{required:true,message:"栏目名称",trigger:'blur'}
					],
					isHot:{required:true,message:"必须填",trigger:'blur'}
				},
				cates:[],
			}
		},
		mounted(){
				this.getCateList();
		},
		methods:{
			getCateList(){
				get_cate_list({}).then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.cates=result.data.rows;
					}else{
						this.$message({
							type:"error",
							message:err.msg
						});
					}
				}).catch((err)=>{
					this.$message({
						type:"error",
						message:err.message
					})
				})
			},
			addSubmit(){
				this.$refs.addForm.validate((valid)=>{
					if(valid){
						add_cate(this.addForm).then((res)=>{
							let result=res.data;
							if(result.error==0){
								this.$message({
									type:'success',
									message:"添加栏目"+this.addForm.cateName+'成功'
								})
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
							message:"确认好再提交"
						})
					}
				})
			}
		}
	}
</script>