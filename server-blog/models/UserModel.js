const mongoose = require("mongoose");
const UserSchema = require("../shemas").UserSchema;
const AsyncValidator = require("async-validator");
const PasswordHash = require("password-hash");
const async = require("async");
const events = require("events");
const eventEmiiter = new events.EventEmitter();
UserSchema.statics.smethod=function(){
	// this.model("blog");
}
UserSchema.statics.newAndSave=function(u){
	let UserModel = this.model("User");
	return new Promise((resolve,reject)=>{
		function validateConfirmPass(rule,value,callback){
			if(u.password!=u.confirmPassword){
				callback(new Error("两次密码不一致"));
			}else{
				callback();
			}
		}
		let rules={
			account:[
					{required:true,message:'请输入账号'},
					{pattern:/^[^\s]{4,20}$/ig,message:"不得含有空格;4-20个字符"},
				],
			password:[
				{required:true,message:"请输入密码"},
				{pattern:/^[^\s]{6,20}$/ig,message:"不得含有空格;6-20个字符"},			
			],
			confirmPassword:[
				{validator:validateConfirmPass}
			],
			email:[
				{type:'email',required:true,message:"请输入正确邮箱"}
			],
			phone:[
				{required:false,message:"请输入正确电话号码",len:11}
			],			

		};
		let validator= new AsyncValidator(rules);
		validator.validate(u,(err,fields)=>{
			if(err){
				console.log(err);
				let msg=err[0].message;
				err=new Error(msg)
				err.status=err;
				return reject(err);
			}else{

				console.log(fields);
				async.series([
					function(callback){
						//find account
						UserModel.findOne({account:u.account},{},(err,doc)=>{
							if(err){
								callback(err.message);
							}else{
								if(doc){
									callback('账号重复了');
								}else{
									callback(null);
								}
							}
						})
					},
					function(callback){
						// find email	
						UserModel.findOne({email:u.email},{},(err,doc)=>{
							if(err){
								callback(err.message);
							}else{
								if(doc){
									callback('邮箱重复了');
								}else{
									callback(null);
								}
							}							
						})
					}
				],(err,rs)=>{
					// console.log(err);
					if(err){
						//402  重复了
						err=new Error(err);
						err.status=402;
						return reject(err);
					}
					
					let user=new UserModel();
					user.account=u.account;
					user.password=PasswordHash.generate(u.password); //生成；
					user.email=u.email;
					user.phone=u.phone||"";
					if(u.avatar){
						user.avatar=u.avatar;
					}else{
						if(user.sex==1){
							user.avatar="/avatar/nan.jpg";
						}else{
							user.avatar="/avatar/nv.jpg";
						}
					}
					user.sex=u.sex;
					user.nickname=u.nickname||u.account;
					user.save((err,data)=>{
						if(err){
							reject(err);		
						}else{
							resolve(data);
						}
					});						
				});

				
							
			} // validate
		});

	})
}

UserSchema.statics.paginate=function(page,limit,keyword){
	let UserModel = this.model("User");
	return new Promise((resolve,reject)=>{
		async.parallel([
			function(callback){
				UserModel.count({
					account:new RegExp(keyword,'i'),
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
				UserModel.find({
						account:new RegExp(keyword,'i'),
						
					},{
						account:1,
						sex:1,
						avatar:1,
						nickname:1,
						email:1,
						created_at:1
					},{
						limit:limit,
						skip:(page-1)*limit,
						sort:{created_at:-1}
					},(err,result)=>{
						// console.log(err,result);
						if(err){
							err.status=403;
							return callback(err);
						}else{
							return callback(null,result)
						}
					});				
			}
		],(err,rs)=>{
			if(err){
				reject(err);
			}else{
				return resolve({
					count:rs[0],
					rows:rs[1]
				});

			}
		})
		

	})	
}
UserSchema.statics.delById=function(id){
	return new Promise((resolve,reject)=>{
		let UserModel = this.model("User");
		UserModel.findByIdAndRemove(id,function(err,doc){
			if(err){
				err.status=403;
				reject(err);
			}else{
				if(!doc){
					var err=new Error("不存在这个人");
						err.status=401;
					return reject(err)
				}
				resolve(doc);
			}	
		})
	})
}

UserSchema.methods.mmethods=function(){
	// this ==> blog;
}




module.exports=mongoose.model("User",UserSchema)