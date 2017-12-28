const mongoose = require("mongoose");
const TagSchema = require("../shemas").TagSchema;
const AsyncValidator = require("async-validator");
const async = require("async");
TagSchema.statics.smethod=function(){
	// this.model("blog");
}

TagSchema.statics.newAndSave=function(obj){
	let TagModel=this.model("Tag");
	// console.log(obj)
	// console.log(obj);
	// return
	return new Promise((resolve,reject)=>{
		async.series([
			function(callback){
				let rules={
					tagName:[
							{required:true,message:'请输入标签名称'},
							{pattern:/^[^\s]{2,12}$/ig,message:"标签名称不得含有空格;2-12个字符"},
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
				TagModel.findOne({
					tagName:obj.tagName
				},function(err,doc){
					if(err){
						err.status=403;
						reject(err);
					}else{
						if(doc){
							
							callback('标签名称已经存在了');
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
					let tag = new TagModel();
						tag.tagName=obj.tagName;
						tag.color=obj.color;
						tag.bgColor=obj.bgColor;
						tag.save((err,doc)=>{
							if(err){
								err.status=405;
								return reject(err);
							}else{
								eventEmitter.emit("admin:addTag",doc)
								// console.log('addtag');
								return resolve(doc);
							}
						})				
					
				}
			});

	})
}
TagSchema.statics.getAllTag=function(opts={}){
	let TagModel=this.model("Tag");
	return new Promise((resolve,reject)=>{
		
		async.parallel([
			function(callback){
				TagModel.count().exec(function(err,count){
						if(err){
							// err.status=405;
							callback(err.message);
						}else{
							callback(null,count);
						}					
				})
			},
			function(callback){
					TagModel.find().exec(function(err,docs){
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
TagSchema.statics.delById=function(id){
	let TagModel = this.model("Tag");
	return new Promise((resolve,reject)=>{
		TagModel.findByIdAndRemove(id,(err,doc)=>{
				if(err){
					reject(err);
				}else{
					if(!doc){
						reject(new Error("不存在此标签"));
					}
					eventEmitter.emit("admin:delTag",doc);
					resolve(doc);
					
				}
		})
	})
}
TagSchema.statics.saveById=function(id,set){

}
TagSchema.methods.mmethods=function(){
	// this ==> blog;
}


module.exports=mongoose.model("Tag",TagSchema)