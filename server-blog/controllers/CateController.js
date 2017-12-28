const gmObj = require("gm");
const gm = gmObj.subClass({imageMagick:true});
const co = require("co");
const formidable = require("formidable");
const events=require("events");
const eventEmitter=new events.EventEmitter();
const fs = require("fs");

const config = require("../config");

const CateModel = require("../models").CateModel;
const tools = require("../common/tools");

exports.add=function(req,res){
	co(async ()=>{
		let cate=await CateModel.newAndSave(req.body);	
		res.json({
			error:0,
			msg:"success",
			data:cate
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

		let result=await CateModel.getAllCate(page,limit,keyword);//分页；	
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

	CateModel.findById(id,function(err,doc){
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
		let cate = await CateModel.delById(id);
		res.json({
			error:0,
			msg:"success",
			data:cate
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
		if(req.body.cateName.length>12 || req.body.cateName<2){
			return Promise.reject('栏目名称不符合格式');
		}
		CateModel.find({
			$or:[
				{_id:req.body._id},
				{cateName:req.body.cateName}
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
							msg:"栏目名称出现重复"
						})
					}else{
						res.json({
							error:401,
							msg:"不存在该栏目，刷新再试"
						})
					}
				}else{
					var doc=docs[0];
					doc.cateName=req.body.cateName;
					doc.pid=req.body.pid;
					doc.isHot=req.body.isHot;
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


