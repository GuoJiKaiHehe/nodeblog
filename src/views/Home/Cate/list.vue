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
				<el-table-column prop="cateName" label="栏目名称" sortable> 
			
				</el-table-column>

			

				<el-table-column prop="created_at" label="是否火热">
					<template slot-scope="scope">
						{{scope.row.isHot?'是':'否'}}
					</template>
				</el-table-column>

				<el-table-column prop="created_at" label="创建时间">
					<template slot-scope="scope">
						{{scope.row.created_at|formatDate}}
					</template>
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
			title="编辑栏目"
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
					<el-form-item label="栏目名称" prop="cateName">
						<el-input v-model="editForm.cateName" placeholder="栏目名称"  auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="父级栏目" prop="pid">
						<el-select v-model="editForm.pid" clearable placeholder="请选择">
						    <el-option
						      v-for="item in list"
						      :key="item._id"
						      :label="item.cateName"
						      :value="item._id">
						    </el-option>
						  </el-select>
					</el-form-item>
					<el-form-item label="是否火热" prop="isHot">
									<el-switch
									  v-model="editForm.isHot"
									  active-color="#13ce66"
									  inactive-color="#ccc">
									</el-switch>
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
import {
	add_cate,
	get_cate_list,
	del_cate_by_id,
	get_cate_by_id,
	save_cate
} from '@/services/CateService';
function gen_edit_form(){
	return {
		_id:"",
		cateName:"",
		pid:"",
		isHot:false
	}
}
	export default{
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
				get_cate_list({}).then((res)=>{
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
				save_cate(this.editForm).then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.$message({
							type:'success',
							message:'编辑:'+this.editForm.cateName+"成功"
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
				get_cate_by_id(row._id).then((res)=>{
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
				this.$confirm("确定要删除这个栏目么").then(()=>{
					console.log(row.id);
					del_cate_by_id(row._id).then((res)=>{
						let result = res.data;
						if(result.error==0){
							this.$message({
								type:"success",
								message:'删除'+row.cateName+"成功"
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