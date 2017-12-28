<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="博文列表" name="list">
    	<list :tags="tags" :cates="cates" />
    </el-tab-pane>
    <el-tab-pane label="博文添加" name="add">
    	<add :tags="tags" :cates="cates" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import list from './list';
import add from './add';
import {
	get_tag_list
} from '@/services/TagService';
import {
	get_cate_list
} from '@/services/CateService';
	export default{
		components:{
			list,
			add
		},
		data(){
			return {
				activeName:"list",
				tags:[],
				cates:[]
			}
		},
		mounted(){
			console.log('list');
			this.get_cates();
			this.get_tags();			
		},
		methods:{
			handleClick(){

			},
get_cates(){
				get_cate_list().then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.cates=result.data.rows;
						
					}else{
						this.$message({
							type:'error',
							message:result.msg
						});
					}
				}).catch((err)=>{
					alert(err);
				})				
			},
			get_tags(){
				get_tag_list().then((res)=>{
					let result=res.data;
					if(result.error==0){
						this.tags=result.data.rows;
						
					}else{
						this.$message({
							type:'error',
							message:result.msg
						});
					}
				}).catch((err)=>{
					alert(err);
				})
			},			
		}
	}
</script>