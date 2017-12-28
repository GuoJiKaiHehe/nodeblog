<template>
	<section>
		
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
				<el-table-column prop="tagName" label="标签名称" sortable> 
			
				</el-table-column>
				<el-table-column prop="color" label="字体颜色" sortable> 

				</el-table-column>				
				<el-table-column prop="bgcolor" label="背景颜色" sortable> 

				</el-table-column>				
				<el-table-column label="操作">
					<template  slot-scope="scope">
						
						<el-button size="small" @click="handleEdit(scope.$index,scope.row)">
							编辑
						</el-button>
						<el-button size="small" type="danger" @click="handleDel(scope.$index,scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
						
		</el-col>
		<el-dialog 
			title="编辑标签"
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
					<el-form-item label="标签名称" prop="tagName">
						<el-input v-model="editForm.tagName" placeholder="标签名称"  auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="字体颜色">
						<chrome-picker v-model="editForm.color" ></chrome-picker>
					</el-form-item>
					<el-form-item label="背景颜色">
						<chrome-picker v-model="editForm.bgcolor" ></chrome-picker>
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
import { Photoshop,Chrome } from 'vue-color'
import {
	add_tag,
	get_tag_list,
	del_tag_by_id,
	get_tag_by_id,
	save_tag
} from '@/services/TagService';
function gen_edit_form(){
	return {
		_id:"",
		bgColor:"",
		color:"",
		tagName:""
	}
}
	export default{
		components:{
			'chrome-picker': Chrome,
		},
		data(){
			return {
				isShowEdit:false,
				btn_loading:false,
				editForm:{},
				editRules:{},
				toolsForm:{
					keyword:"",
				},
				fetching_data:false,
				list:[],
				editForm:gen_edit_form()
			}
		},
		mounted(){
			this.fetchData();
		},
		methods:{
			fetchData(){
				this.fetching_data=true;
				get_tag_list({}).then((res)=>{
					let result=res.data;
					this.fetching_data=false;
					if(result.error==0){
						this.list=result.data.rows;
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
			editSubmit(){
				console.log(this.editForm);
				if(typeof this.editForm.color == 'object'){
					this.editForm.color=this.editForm.color.hex;
				}
				if(typeof this.editForm.bgcolor == 'object'){
					this.editForm.bgcolor=this.editForm.bgcolor.hex;
				}
				save_tag(this.editForm).then((res)=>{
					let result=res.data;
					if(result.error==0){

						this.$message({
							type:'success',
							message:'编辑:'+this.editForm.tagName+"成功"
						})
					}else{
						this.$message({
							type:"error",
							message:result.msg
						})
					}
					this.fetchData();
				}).catch((err)=>{
					alert(err);
				})
			},
			handleEdit(index,row){
				get_tag_by_id(row._id).then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.isShowEdit=true;
						if(result.data.pid==0){
							result.data.pid="";
						}
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
				this.$confirm("确定要删除这个标签么").then(()=>{
					console.log(row.id);
					del_tag_by_id(row._id).then((res)=>{
						let result = res.data;
						if(result.error==0){
							this.$message({
								type:"success",
								message:'删除'+row.tagName+"成功"
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
			selectedRows(rows){

			},
			edit_handleBeforeClose(){
				this.editForm=gen_edit_form();
				this.isShowEdit=false;
			}
		}
	}
</script>

<style>
	
</style>