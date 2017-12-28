<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="管理员列表" name="list">
    	<list />
    </el-tab-pane>
    <el-tab-pane label="管理员添加" name="add">
    	<add />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import list from './list';
import add from './add';
	export default{
		components:{
			list,
			add
		},
		data(){
			return {
				activeName:"list"
			}
		},
		mounted(){
			console.log('list');
		},
		methods:{
			handleClick(){

			}
		}
	}
</script>