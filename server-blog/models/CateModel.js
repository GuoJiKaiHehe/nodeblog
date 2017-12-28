const mongoose = require("mongoose");
const CateSchema = require("../shemas").CateSchema;
const AsyncValidator = require("async-validator");
const async = require("async");
CateSchema.statics.smethod=function(){
	// this.model("blog");
}
CateSchema.statics.newAndSave=function(obj){
	let CateModel=this.model("Cate");
	// console.log(obj);
	return new Promise((resolve,reject)=>{
		async.series([
			function(callback){
				let rules={
					cateName:[
							{required:true,message:'请输入栏目名称'},
							{pattern:/^[^\s]{2,12}$/ig,message:"栏目名称不得含有空格;2-12个字符"},
						],

				};				
				let validator= new AsyncValidator(rules);
					validator.validate(obj,function(err,fields){
						// console.log(err,fields);
					if(err){
						// console.log(err);
						let msg=err[0].message;
						
						callback(msg);							
					}else{
						callback(null);
					}						
				})
			},function(callback){
				CateModel.findOne({
					cateName:obj.cateName
				},function(err,doc){
					if(err){
						err.status=403;
						reject(err);
					}else{
						if(doc){
							
							callback('栏目名称已经存在了');
						}else{
							callback(null);
						}
					}
				})
			}
			],function(err,rs){
				if(err){
					var err=new Error(err);
					err.status=405;
					return reject(err);
				}else{
					let cate = new CateModel();
						cate.cateName=obj.cateName;
						cate.isHot=obj.isHot;
					if(obj.pid){
						cate.pid=obj.pid;
						CateModel.findOne({
							_id:obj.pid,
						},{
							level:1
						},function(err,doc){
							if(err){
								err.status=405;
								reject(err);
							}else{
								cate.level=doc.level+1;
								cate.save(function(err,doc){
										if(err){
											err.status=405;
											reject(err);
										}else{

											resolve(doc);
										}
								});
							}
						})
						// cate.level=1;
					}else{
						cate.level=0; //顶级；
						cate.pid=0;
						cate.save(function(err,doc){
							if(err){
								err.status=405;
								reject(err);
							}else{
								global.eventEmitter.emit("admin:addCate",doc);
								resolve(null,doc);
							}					
						})
					}					
					
				}
			});

	})
}
CateSchema.statics.getAllCate=function(opts={}){
	let CateModel=this.model("Cate");
	return new Promise((resolve,reject)=>{
		
		async.parallel([
			function(callback){
				CateModel.count().exec(function(err,count){
						if(err){
							// err.status=405;
							callback(err.message);
						}else{
							callback(null,count);
						}					
				})
			},
			function(callback){
					CateModel.find().exec(function(err,docs){
							if(err){
								
								callback(err.message);
							}else{
								callback(null,docs);
							}
					})				
			}
		],function(err,rs){
			if(err){
				reject(new Error(err));
			}else{
				// console.log(rs);
				resolve({
					rows:rs[1],
					count:rs[0]
				});
			}
		})
	})
}
CateSchema.statics.delById=function(id){
	let CateModel = this.model("Cate");
	return new Promise((resolve,reject)=>{
		CateModel.findByIdAndRemove(id,(err,doc)=>{
				if(err){
					reject(err);
				}else{
					if(!doc){
						reject(new Error("不存在此栏目"));
					}
					global.eventEmitter.emit("admin:delCate",doc);
					resolve(doc);
					
				}
		})
	})
}
CateSchema.statics.saveById=function(id,set){

}
CateSchema.methods.mmethods=function(){
	// this ==> blog;
}


module.exports=mongoose.model("Cate",CateSchema)