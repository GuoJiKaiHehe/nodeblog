const gmObj = require("gm");
const gm = gmObj.subClass({imageMagick:true});
const co = require("co");
const formidable = require("formidable");
const events=require("events");
const eventEmitter=new events.EventEmitter();
const fs = require("fs");

const config = require("../config");

const TagModel = require("../models").TagModel;
const tools = require("../common/tools");

exports.add=function(req,res){
	co(async ()=>{
		
		let tag=await TagModel.newAndSave(req.body);	
		res.json({
			error:0,
			msg:"success",
			data:tag
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

		let result=await TagModel.getAllTag(page,limit,keyword);//分页；	
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

	TagModel.findById(id,function(err,doc){
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
		let tag = await TagModel.delById(id);
		res.json({
			error:0,
			msg:"success",
			data:tag
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
		if(req.body.tagName.length>12 || req.body.tagName<2){
			return Promise.reject('标签名称不符合格式');
		}
		TagModel.find({
			$or:[
				{_id:req.body._id},
				{tagName:req.body.tagName}
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
							msg:"标签名称出现重复"
						})
					}else{
						res.json({
							error:401,
							msg:"不存在该标签，刷新再试"
						})
					}
				}else{
					var doc=docs[0];
					doc.tagName=req.body.tagName;
					doc.color=req.body.color;
					doc.bgcolor=req.body.bgcolor;
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


