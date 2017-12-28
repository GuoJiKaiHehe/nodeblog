
const gmObj = require("gm");
const gm = gmObj.subClass({imageMagick:true});
const co = require("co");
const formidable = require("formidable");
const events=require("events");
const eventEmitter=new events.EventEmitter();
const fs = require("fs");
const PasswordHash= require("password-hash");
const UserModel=require("../models/UserModel");
const config = require("../config/index");
// req.signedCookies[config.auth_cookie_name];
exports.login=function(req,res){
	co(async ()=>{
		var user=await UserModel.findOne({
				account:req.body.account
			}).exec();
		if(user){
			console.log(user);
			if(!PasswordHash.verify(req.body.password,user.password)){
				res.json({
					error:401,
					msg:"账号或密码错误",
				})
			}else{
				var auto_token=user._id+"%%%%";
				var opts={
					path:"/",
					maxAge:1000 * 60 * 60 * 24 * 30, //30填;
					signed:true,
					httpOnly:true
				}
				res.cookie(config.auth_cookie_name,auto_token,opts);
				return res.json({
					error:0,
					msg:"success",
					data:user
				})
			}

		}else{
			return Promise.reject(new Error("账号或密码错误"));
		}
	}).catch((err)=>{
			res.json({
				error:err.status||401,
				msg:err.message

			})
	});
}


exports.loginByCookie=function(req,res){
	co(async ()=>{
		var token=req.signedCookies[config.auth_cookie_name];
		console.log(token)
		var id=token.split('%%%%')[0];
		var user =await UserModel.findById(id).exec();		
		if(user){
			res.json({
				error:0,
				msg:"success",
				data:user
			});
			return;
		}else{
			res.json({
				error:403,
				msg:"没有登录"
			});
		}
	}).catch((err)=>{
			res.json({
			error:err.status||401,
			msg:err.message

			})		
	})
	

}
