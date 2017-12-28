<template>
	<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">
		<el-form-item label="博文标题" prop="title">
			<el-input v-model="addForm.title" placeholder="博文标题"  auto-complete="off"></el-input>
		</el-form-item>
		
		<el-form-item label="博文标签">
			<el-checkbox :indeterminate="isIndeterminate" v-model="tag_checkAll" @change="tag_handleCheckAllChange">全选</el-checkbox>
			<div style="margin: 15px 0;"></div>
			<el-checkbox-group v-model="addForm.tags" @change="tag_handleCheckedCitiesChange">
				<el-checkbox v-for="item in tags" :label="item" :key="item._id">{{item.tagName}}</el-checkbox>
			</el-checkbox-group>

		</el-form-item>
		<el-form-item label="博文分类">
			<el-checkbox :indeterminate="cate_isIndeterminate" v-model="cate_checkAll" @change="cate_handleCheckAllChange">全选</el-checkbox>
			<div style="margin: 15px 0;"></div>
			<el-checkbox-group v-model="addForm.cates" @change="cate_handleCheckedCitiesChange">
				<el-checkbox v-for="item in cates" :label="item" :key="item._id">{{item.cateName}}</el-checkbox>
			</el-checkbox-group>			
		</el-form-item>
		<el-form-item label="博文摘要">
				<el-input
			  type="textarea"
			  :rows="2"
			  placeholder="请输入博文摘要"
			  v-model="addForm.summary">
			</el-input>
		</el-form-item>
		<el-form-item label="主要内容">
			<mavon-editor  ref="md" v-model="addForm.content" :ishljs = "true" @imgAdd="imgAdd" @imgDel="imgDel"/>
		</el-form-item>
		<el-form-item label="是否发布">
				<el-switch
				  v-model="addForm.is_publish"
				  active-color="#13ce66"
				  inactive-color="#cccc">
				</el-switch>

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
	get_tag_list
} from '@/services/TagService';
import {
	get_cate_list
} from '@/services/CateService';

import {
	add_blog,
	upload_blog_img
} from '@/services/BlogService';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

function gen_add_form(){
	return {
		title:"",
		content:"",
		tags:[],
		cates:[],
		summary:"",
		is_publish:false
	}
}
	export default{
		props:{
			tags:{type:Array},
			cates:{type:Array}
		},
		components:{
			'mavon-editor':mavonEditor.mavonEditor
		},
		data(){
			return {
				tag_checkAll:false,
				cate_checkAll:false,
				isIndeterminate: true,
				cate_isIndeterminate: true,
				btn_loading:false,
				addForm:gen_add_form(),
				addFormRules:{

				},
				
			}
		},
		mounted(){
			
		},
		methods:{
			imgAdd(pos,$file){
				// console.log(pos,$file)
				// this.$refs.md.$img2Url(pos,'guojikai');
				let formdata=new FormData();
				formdata.append('image',$file);
				upload_blog_img(formdata).then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.$refs.md.$img2Url(pos,result.data.url);
					}else{
						this.$message({
							type:'error',
							message:result.msg
						})
					}
				}).catch((err)=>{
					this.$message({
						type:'error',
						message:err.message
					})
				})
			},
			imgDel(filename){
				console.log(filename);
			},		
			addSubmit(){
				console.log(this.addForm);
				add_blog(this.addForm).then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.$message({
							type:'success',
							message:"博文:'"+this.addForm.title+"'  发布成功"
						});
					}else{
						this.$message({
							type:"error",
							message:"博文发布失败："+result.msg
						});
					}
				})
			},
			
			tag_handleCheckedCitiesChange(value){
				// console.log(this.tags);
				let checkedCount = value.length;
				// console.log(checkedCount,'checkedCount',value);
		        this.tag_checkAll = checkedCount === this.tags.length;
		        // console.log( checkedCount > 0 && checkedCount < this.tags.length);
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.tags.length;
			},
			tag_handleCheckAllChange(val){
				let tags=this.tags;
				this.addForm.tags = val ? tags : [];
       			 this.isIndeterminate = false;
			},
			cate_handleCheckedCitiesChange(value){
				// console.log(this.cates);
				let checkedCount = value.length;
				// console.log(checkedCount,'checkedCount',value);
		        this.cate_checkAll = checkedCount === this.cates.length;
		        // console.log( checkedCount > 0 && checkedCount < this.cates.length);
		        this.cate_isIndeterminate = checkedCount > 0 && checkedCount < this.cates.length;
			},
			cate_handleCheckAllChange(val){
				let cates=this.cates;
				this.addForm.tags = val ? tags : [];
       			 this.cate_isIndeterminate = false;
			},			
		}
	}
</script>

<style>
	
</style>