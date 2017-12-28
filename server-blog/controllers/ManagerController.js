const gmObj = require("gm");
const gm = gmObj.subClass({imageMagick:true});
const co = require("co");
const formidable = require("formidable");
const events=require("events");
const eventEmitter=new events.EventEmitter();
const fs = require("fs");

const config = require("../config");

const UserModel = require("../models/UserModel");
exports.add=function(req,res){
	co(async ()=>{
		let user=await UserModel.newAndSave(req.body);	
		res.json({
			error:0,
			msg:"success",
			data:user
		});
	}).catch((err)=>{
		res.json({
			error:err.status||401,
			msg:err.message
		})
		return
	})
}

exports.list=function(req,res){
	co(async ()=>{
		console.log(req.body);
		let page=req.body.page || 1;
		let limit=req.body.limit || 10;
		let keyword=req.body.keyword||"";

		let result=await UserModel.paginate(page,limit,keyword);//分页；	
		res.json({
			error:0,
			msg:"success",
			data:result
		});
	}).catch((err)=>{
		res.json({
			error:401,
			msg:err
		})
		return
	})
}

exports.findById=function(req,res){
	let id = req.body.id;

	UserModel.findById(id,function(err,doc){
		if(err){
			err.status=403
			res.json({
				error:err.status,
				msg:err.message
			});
		}else{
			res.json({
				error:0,
				msg:'success',
				data:doc
			})
		}
	})
}

exports.delById=function(req,res){
	co(async ()=>{
		let id=req.body.id;
		let user = await UserModel.delById(id);
		res.json({
			error:0,
			msg:"success",
			data:user
		})
	}).catch((err)=>{
		res.json({
			error:err.status,
			msg:err.message
		})
		return
	})
	UserModel.delById();
}

exports.saveById=function(){

}

exports.upload={
	avatar:function(req,res){
		co(async ()=>{
			eventEmitter.once('success',(data)=>{
				res.json({
					error:0,
					msg:"success",
					data:data
				})
				return;
			});
			eventEmitter.once("error",(code,msg)=>{
				res.json({
					error:code,
					msg:msg
				})
				return;
			})

			let rootPath=config.rootPath;
			let form = new formidable.IncomingForm();
			form.uploadDir = rootPath+'public/uploads/avatar';
			if(!fs.existsSync(form.uploadDir)){
				fs.mkdirSync(form.uploadDir);
			}
			form.encoding='utf-8';
			form.keepExtensions=true;
			form.mutiples=false;
			form.maxFields=100; //最大字段值；
			form.maxFieldsSize=2*1024*1024; //2m
			form.parse(req,(err,fields,files)=>{
				let path=files.avatar.path;
				let size=files.avatar.size;
				let name=files.avatar.name;
				let type=files.avatar.type;
				let index=path.lastIndexOf("/");
				let true_name=path.substr(index+1);				
				gm(path)
				.resize(config.avatar.width,config.avatar.height,'!')
				.noProfile()
				.write(path,(err)=>{
					if(err)
						return eventEmitter.emit('error',433,'缩小出错');
					else
						return eventEmitter.emit("success",{
								path,
								size,
								name,
								type,
								true_name							
						})
				})
			})
			form.on('error',(err)=>{
				return eventEmitter.emit('error',434,'上传出错');
			})
		}).catch((err)=>{
			res.json({
				error:401,
				msg:err.message
			})
		})
	}
}


