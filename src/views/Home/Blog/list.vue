<template>
	<section>
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="toolsForm">
				<el-form-item prop="keyword">
					<el-input placeholder="博文标题模糊查询" v-model="toolsForm.keyword" @keyup.enter.native="searchByKeyword"></el-input>
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
				<el-table-column prop="title" label="标题 " sortable> 
				</el-table-column>
				<el-table-column prop="summary" label="摘要">

				</el-table-column>
				<el-table-column label="是否已经发布">
					<template slot-scope="scope">
						{{scope.row.is_publish?'已经发布':"未发布"}}
					</template>
				</el-table-column>	

				<el-table-column label="浏览次数">
					<template slot-scope="scope">
						{{scope.row.views+'次'}}
					</template>					
				</el-table-column>		
				<el-table-column label="评论次数">
					<template slot-scope="scope">
						0
					</template>					
				</el-table-column>
				<el-table-column label="标签">
					<template slot-scope="scope">
						{{scope.row.tags.map((item)=>item.tagName).join("、")}}
					</template>
				</el-table-column>
				<el-table-column label="分类">
					<template slot-scope="scope">
						{{scope.row.cates.map((item)=>item.cateName).join("、")}}
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
			width="80%"
			title="编辑管理员"
			:visible.sync="isShowEdit"
			:before-close="edit_handleBeforeClose"
			:fullscreen="false"
			:lock-scroll="true"
			:close-on-click-modal="false"
		>
			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="80px">
				<el-form-item label="博文标题" prop="title">
					<el-input v-model="editForm.title" placeholder="博文标题"  auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="博文标签">
					<el-checkbox :indeterminate="isIndeterminate" v-model="tag_checkAll" @change="tag_handleCheckAllChange">全选</el-checkbox>
					<div style="margin: 15px 0;"></div>
					<el-checkbox-group v-model="editForm.tags" @change="tag_handleCheckedCitiesChange">
						<el-checkbox v-for="item in tags" :label="item._id" :key="item._id">{{item.tagName}}</el-checkbox>
					</el-checkbox-group>

				</el-form-item>
				<el-form-item label="博文分类">
					<el-checkbox :indeterminate="cate_isIndeterminate" v-model="cate_checkAll" @change="cate_handleCheckAllChange">全选</el-checkbox>
					<div style="margin: 15px 0;"></div>
					<el-checkbox-group v-model="editForm.cates" @change="cate_handleCheckedCitiesChange">
						<el-checkbox v-for="item in cates" :label="item._id" :key="item._id">{{item.cateName}}</el-checkbox>
					</el-checkbox-group>			
				</el-form-item>
				<el-form-item label="博文摘要">
						<el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入博文摘要"
					  v-model="editForm.summary">
					</el-input>
				</el-form-item>
				<el-form-item label="主要内容">
					<mavon-editor  ref="md" v-model="editForm.content" :ishljs = "true" @imgAdd="imgAdd" @imgDel="imgDel"/>
				</el-form-item>
				<el-form-item label="是否发布">
						<el-switch
						  v-model="editForm.is_publish"
						  active-color="#13ce66"
						  inactive-color="#cccc">
						</el-switch>

				</el-form-item>
				<el-form-item>
					<el-button @click.native.prevent="editSubmit" type="primary" :loading="btn_loading">
						保存
					</el-button>
				</el-form-item>	
			</el-form>	
		</el-dialog>			
	</section>
</template>


<script>

import {
	get_blog_list,
	del_blog_by_id,
	get_blog_by_id,
	upload_blog_img,
	save_blog
} from '@/services/BlogService';

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
function gen_edit_form(){
	return {
		title:"",
		content:"",
		tags:[],
		cates:[],
		summary:"",
		is_publish:false
	}
}
	export default {
		components:{
			'mavon-editor':mavonEditor.mavonEditor
		},
		props:{
			tags:{type:Array},
			cates:{type:Array}
		},
		data(){
			return {
				tag_checkAll:false,
				cate_checkAll:false,
				isIndeterminate: true,
				cate_isIndeterminate: true,				
				toolsForm:{
					keyword:"",
				},
				fetching_data:false,
				isShowEdit:false,
				btn_loading:false,
				editForm:{},
				editRules:{},
				toolsForm:{
					keyword:"",
				},
				fetching_data:false,
				list:[],
				editForm:gen_edit_form(),
				editFormRules:{},
				page:1,
				limit:10,
				total:0,		
			}
		},
		mounted(){
			this.fetchData();
		},	
		methods:{
			handleDel(index,row){
				this.$confirm("确定要删除这篇博文么").then(()=>{
					console.log(row.id);
					del_blog_by_id(row._id).then((res)=>{
						let result = res.data;
						if(result.error==0){
							this.$message({
								type:"success",
								message:'删除'+row.title+"成功"
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
			handleEdit(index,row){
				get_blog_by_id(row._id).then((res)=>{
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
				// console.log(filename);
				console.log('删除图片');
			},			
			searchByKeyword(){
				this.fetchData();
			},
			fetchData(){

				let opts={
					page:this.page,
					limit:this.limit,
					keyword:this.toolsForm.keyword,
				};
				this.fetching_data=true;
				get_blog_list(opts).then((res)=>{
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
			selectedRows(rows){
				console.log(rows)
			},
			handleSizeChange(val){
				this.limit=val;
				this.fetchData();
			},
			handleCurrentChange(page){
				this.page=page;
				this.fetchData();
			},	
			edit_handleBeforeClose(){
				this.isShowEdit=false;
			},

			editSubmit(){
				save_blog(this.editForm).then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.$message({
							type:'success',
							message:"修改成功"
						})
					}else{
						this.$message({
							type:'error',
							message:result.msg
						})
					}
					this.fetchData();
				}).catch((err)=>{
					this.$message({
						type:'error',
						message:err.message
					})
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
		},
		filters:{
			showCate(item){
				// console.log(item);
				// if()
				return item[0].cateName+'、';
			},
			showTag(item){
				return item[0].tagName+'、';
			}
			
		}	
	}
</script>

<style>
	
</style>