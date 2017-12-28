const mongoose = require("mongoose");
const BlogSchema = require("../shemas").BlogSchema;
const AsyncValidator = require("async-validator");
const PasswordHash = require("password-hash");
const async = require("async");
const tools = require("../common/tools");
const events = require("events");
const eventEmitter= new events.EventEmitter();
const co = require("co");
const timeago= require("timeago.js");
const _ = require("lodash")
var timeagoInstance = new timeago("zh_CN");

BlogSchema.statics.smethod=function(){
	// this.model("blog");
}
BlogSchema.statics.newAndSave=function(obj){
	// console.log(obj);
	console.log(obj,'aaa');
	let BlogModel= this.model("Blog");
	return new Promise((resolve,reject)=>{
		let rules={
			title:[
					{required:true,message:'博文标题是必须的'},
					{pattern:/^[^\s]{2,50}$/ig,message:"不得含有空格;2-50个字符"},
				],
			content:[
				{required:true,message:"博文内容是必须的"},
				{min:10,message:"至少10个字符"},
			]
		};		
		let validator= new AsyncValidator(rules);
		
		async.series([
			function(callback){
				//验证字段
				validator.validate(obj,(err,fields)=>{
					if(err){
						callback(err[0].message);
					}else{
						callback(null);
					}
				});				
			},
			function(callback){
				//检查标题
				BlogModel.findOne({
					title:obj.title
				},function(err,doc){
					if(err){
						callback(err.message);
					}else{
						if(!doc){
							callback(null);
						}else{
							callback("博文标题有重复了");
						}
					}
				})
			}
		],function(err,rs){
			//插入数据库；
			console.log(rs,err,'-----');
			if(err){
				err=new Error(err);
				err.stauts=405
				reject(err);
			}else{
				// resolve(rs);
				let blog= new BlogModel();
				blog.title=obj.title;
				blog.content=obj.content;
				blog.is_publish=obj.is_publish;
				blog.summary=obj.summary||"";
				// blog.

				tag_ids=obj.tags.map((item)=>item._id);
				cate_ids=obj.cates.map((item)=>item._id);
				tag_ids=tools.trimFalse(tag_ids);
				cate_ids=tools.trimFalse(cate_ids);
				blog.tags=tag_ids;
				blog.cates=cate_ids;
				blog.save((err,doc)=>{
					if(err){
						err.status=405;
						reject(err);
					}else{
						var created_at=timeagoInstance.format(doc.created_at);
						var ioblog={};
						_.extend(ioblog,doc);
						ioblog.created_at=created_at;
						global.eventEmitter.emit("admin:addBlog",ioblog);
						resolve(doc);
					}
				})
			}
		})
	})
}
BlogSchema.statics.paginateTest=function(){
	console.log(arguments);
	return;
}
BlogSchema.statics.paginate=function(page=1,limit=10,keyword="",where={}){
	let BlogModel = this.model("Blog");
	let CateModel = this.model("Cate");
	let TagModel = this.model("Tag")
	console.log(where,'wheere',keyword,limit,arguments);
	return new Promise((resolve,reject)=>{
		async.parallel([
			function(callback){
				BlogModel.count({
					title:new RegExp(keyword,'i'),
					...where
				},(err,rs)=>{
					if(err){
						err.status=403
						callback(err);
					}else{
						callback(null,rs)
					}
				})
			},
			function(callback){
				BlogModel.find({
						title:new RegExp(keyword,'i'),
						...where
					},{},{
						limit:limit,
						skip:(page-1)*limit,
						sort:{created_at:-1}
					})
					.populate([
						{path:"cate"},
						{path:"Tag"}
						])
					.exec((err,result)=>{
						// console.log(err,result);
						if(err){
							err.status=403;
							return callback(err);
						}else{
							return callback(null,result)
								

						}
					})				
			}
		],(err,rs)=>{
			if(err){
				reject(err);
			}else{
				// console.log(rs);

				let count=0;
				let rows=rs[1];
				// var row=rows[0];
				/*console.log(row.tags);
				TagModel.find({
					_id:{
						$in:row.tags
					}
				}).exec(function(err,ts){
					console.log(ts);
				})*/
				co(async ()=>{
					for(var i=0;i<rows.length;i++){
						rows[i].tags=await TagModel.find({
							_id:{
								$in:rows[i].tags
							}
						}).exec();
						rows[i].cates=await CateModel.find({
							_id:{
								$in:rows[i].cates
							}
						}).exec();													
					}
					// console.log(tags);
					resolve({
						count:rs[0],
						rows:rs[1]
					});									
				}).catch((err)=>{
					reject(err);
				})
				
				
				

			}
		})
		

	})	
}

BlogSchema.statics.incViewById=function(id,count=0){
	let BlogModel = this.model("Blog");
	return BlogModel.update({_id:id},{$inc:{views:1}}).exec();
	
}
BlogSchema.statics.delById=function(id){
		let BlogModel = this.model("Blog");
		return new Promise((resolve,reject)=>{
			BlogModel.findByIdAndRemove(id,(err,doc)=>{
					if(err){
						reject(err);
					}else{
						if(!doc){
							reject(new Error("不存在此博文"));
						}
						resolve(doc);
						
					}
			})
		})	
}
BlogSchema.statics.findListByCateId=function(cate_id,page=1,limit=20,keyword=""){
	
}
BlogSchema.methods.mmethods=function(){
	// this ==> blog;
}


module.exports=mongoose.model("Blog",BlogSchema)