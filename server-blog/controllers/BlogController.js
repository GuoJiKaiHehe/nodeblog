const gmObj = require("gm");
const gm = gmObj.subClass({imageMagick:true});
const co = require("co");
const formidable = require("formidable");
const events=require("events");
const eventEmitter=new events.EventEmitter();
const fs = require("fs");

const config = require("../config");

const BlogModel = require("../models").BlogModel;
const TagModel = require("../models").TagModel;
const CateModel = require("../models").CateModel;
const tools = require("../common/tools");

exports.add=function(req,res){
	co(async ()=>{

		let blog=await BlogModel.newAndSave(req.body);	
		res.json({
			error:0,
			msg:"success",
			data:blog
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
		// console.log(req.body);
		let page=req.body.page || 1;
		let limit=req.body.limit || 10;
		let keyword=req.body.keyword||"";

		let result=await BlogModel.paginate(page,limit,keyword);//分页；	
		// console.log(result);
		// result.rows=tools.wuxian_fenlei(result.rows);
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
	co(async ()=>{
		var doc=await BlogModel.findById(id).exec();
		if(doc){
			/*doc.tags=await TagModel.find({
						_id:{
							$in:doc.tags
						}
					}).exec();
			doc.cates=await CateModel.find({
				_id:{
					$in:doc.cates
				}
			})*/
			res.json({
				error:0,
				msg:'success',
				data:doc
			});
		}else{
			res.json({
				error:402,
				msg:"不存在这篇博文",

			})
		}
	}).catch((err)=>{
		res.json({
			error:err.status||401,
			msg:err.message
		})
	})
	
}

exports.delById=function(req,res){
	co(async ()=>{
		let id=req.body.id;
		let blog = await BlogModel.delById(id);
		res.json({
			error:0,
			msg:"success",
			data:blog
		})
	}).catch((err)=>{
		res.json({
			error:err.status||401,
			msg:err.message
		})
		return
	})
	
}

exports.save=function(req,res){
	co(async ()=>{	
		// console.log(req.body);
		// return;
		if(req.body.title==""){
			return Promise.reject(new Error("标题不的为空"));
		}
		if(req.body.content==""){
			return Promise.reject(new Error("内容不的为空"))
		}
		BlogModel.find({
			$or:[
				{_id:req.body._id},
				{title:req.body.title}
			]
		},function(err,docs){
			if(err){
				res.json({
					error:405,
					msg:err.message
				})
				return;
			}else{
				if(docs.length>=2 || docs.length==0){
					if(docs.length>=2){
						res.json({
							error:401,
							msg:"博文标题出现重复"
						})
					}else{
						res.json({
							error:401,
							msg:"不存在该博文，刷新再试"
						})
					}
				}else{
					var doc=docs[0];
					doc.title=req.body.title;
					doc.content=req.body.content;
					doc.is_publish=req.body.is_publish;
					doc.cates=req.body.cates;
					doc.tags=req.body.tags;
					doc.summary=req.body.summary;
					doc.save((err,doc)=>{
						if(err){

						}else{
							res.json({
								error:0,
								msg:'success',
								data:doc
							})							
						}
					})
					// console.log(docs)
					
				}
			}
		})
	}).catch((err)=>{
		res.json({
			error:err.status||401,
			msg:err.message
		})
		return
	})
}

exports.upload={
	contentImg(req,res){
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
			form.uploadDir = rootPath+'public/uploads/contentImg';
			if(!fs.existsSync(form.uploadDir)){
				fs.mkdirSync(form.uploadDir);
			}
			form.encoding='utf-8';
			form.keepExtensions=true;
			form.mutiples=false;
			form.maxFields=100; //最大字段值；
			form.maxFieldsSize=2*1024*1024; //2m
			form.parse(req,(err,fields,files)=>{
				let path=files.image.path;
				let size=files.image.size;
				let name=files.image.name;
				let type=files.image.type;
				let index=path.lastIndexOf("/");
				let true_name=path.substr(index+1);	
				let url = '/uploads/contentImg/'+true_name;			
				eventEmitter.emit('success',{
					path,
					size,
					name,
					type,
					url,
					true_name
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


