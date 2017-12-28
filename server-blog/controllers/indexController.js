//前台；
const CateModel = require("../models/CateModel");
const BlogModel = require("../models/BlogModel")
const TagModel = require("../models/TagModel")
const co= require("co");
var MarkdownIt = require('markdown-it');
var md=new MarkdownIt();
exports.common=function(req,res,next){
// let 
	co(async ()=>{
		let cates_result = await CateModel.getAllCate();
		let tags_result = await  TagModel.getAllTag();	
		res.locals.cates=cates_result.rows;
		res.locals.tags=tags_result.rows;
		res.locals.req=req;
		next();		
	}).catch((err)=>{
		res.render('error',{
			error:err,
			message:err.message
		});		
	})
		
}
exports.index=function(req,res){
	// res.send("welcome");
	co(async  ()=>{
		let page=req.query.page||1
		// let 
		let cates_result = await CateModel.getAllCate();
		let tags_result = await  TagModel.getAllTag();

		let blogs_result = await  BlogModel.paginate(page,20,"",{is_publish:true});
		// console.log(cates);
		res.render('index',{
			title:"首页",
			blogs:blogs_result.rows,
		});			
	}).catch((err)=>{
		// console.log('message',err.message);
		res.render('error',{
			error:err,
			message:err.message
		});
	})
	
}

exports.detail_blog=function(req,res){
	co(async ()=>{
		let id=req.params.id;
		await BlogModel.incViewById(id,1);
		let blog = await BlogModel.findOne({
					_id:id
				}).exec();
		blog.content=md.render(blog.content);

		res.render('blog/details',{
			title:blog.title,
			blog:blog,

		});
	}).catch((err)=>{
		res.render('error',{
			error:err,
			message:err.message
		})
	})
}


exports.show_cate=function(req,res){
	co(async ()=>{
		let id=req.params.id;
		let page=req.query.page||1;
		var cate=await CateModel.findOne({
				_id:id
		});
		var  blogs_result= await BlogModel.paginate(page,20,"",{is_publish:true});
		// console.log(blogs_result);
		blogs=blogs_result.rows.filter((item)=>{
			// console.log(item.cates);
			item.cates.some((ca)=>{
				console.log(typeof ca._id);
			})
			return item.cates.some((ca)=>String(ca._id)==cate._id);
		})
		res.render('index',{
			title:cate.cateName,
			blogs:blogs

		});
	}).catch((err)=>{
		res.render('error',{
			error:err,
			message:err.message
		})
	})	
}