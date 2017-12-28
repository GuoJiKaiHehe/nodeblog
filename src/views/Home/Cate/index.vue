<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="栏目列表" name="list">
    	<list />
    </el-tab-pane>
    <el-tab-pane label="添加栏目" name="add">
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