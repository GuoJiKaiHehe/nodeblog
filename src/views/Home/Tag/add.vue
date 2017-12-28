<template>
	<section>
		<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">
			<el-form-item label="标签名称" prop="tagName">
				<el-input v-model="addForm.tagName" placeholder="标签名称"  auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="字体颜色">
				<chrome-picker v-model="color" ></chrome-picker>
			</el-form-item>
			<el-form-item label="背景颜色">
				<chrome-picker v-model="bgColor" ></chrome-picker>
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
import { Photoshop,Chrome } from 'vue-color'
import * as vueColor from 'vue-color'
// console.log(vueColor.Chrome);
import {
	add_tag,
} from '@/services/TagService';

function gen_add_form(){
	return {
		tagName:"",
		color:"",
		bgColor:"",
	}
}
	export default{
		components:{
			'photoshop-picker': Photoshop,
			'chrome-picker': Chrome,
		},	
		data(){
			return {
				color:"#000",
				bgColor:"#20a0ff",
				btn_loading:false,
				addForm:gen_add_form(),
				addFormRules:{
					tagName:[
						{required:true,message:"标签名称",trigger:'blur'}
					],
					isHot:{required:true,message:"必须填",trigger:'blur'}
				},
				tags:[],
			}
		},
		mounted(){
				// this.getTagList();
		},
		methods:{
			selectColor(){

			},
			
			addSubmit(){
				console.log(this.color);
				this.$refs.addForm.validate((valid)=>{
					if(valid){
						var bgColor=this.bgColor;
						var color=this.color;
						this.addForm.bgColor=bgColor.hex;
						this.addForm.color=color.hex;
						add_tag(this.addForm).then((res)=>{
							let result=res.data;
							if(result.error==0){
								this.$message({
									type:'success',
									message:"添加标签"+this.addForm.tagName+'成功'
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