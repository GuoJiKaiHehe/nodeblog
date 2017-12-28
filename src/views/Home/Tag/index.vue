<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="标签列表" name="list">
    	<list />
    </el-tab-pane>
    <el-tab-pane label="添加标签" name="add">
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