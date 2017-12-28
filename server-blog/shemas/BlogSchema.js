const mongoose = require("mongoose"),
	  Schema = mongoose.Schema,
	  ObjectId = Schema.Types.ObjectId;



const BlogSchema=new Schema({
	user_id:{type:ObjectId,ref:"User"}, //发布的人；
	title:{type:String}, //文章标题
	content:{type:String}, //内容
	summary:{type:String}, //摘要，可不填
	is_publish:{type:Boolean,default:false},
	views:{type:Number,default:0}, //浏览次数
	tags:[{type:ObjectId,ref:"Tag"}], //标签数；
	cates:[{type:ObjectId,ref:"Cate"}], //分类
	praise:{type:Number,default:0},
	created_at:{type:Date,default:Date.now()},
	updated_at:{type:Date,default:Date.now()}
})

module.exports=BlogSchema;
