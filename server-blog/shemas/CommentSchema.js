var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.Types.ObjectId;   


 const CommentsSchema = new Schema({
 	blog_id:{type:ObjectId},
 	reply_id:{type:ObjectId,default:""}, //回复人；
 	user_id:{type:ObjectId,default:""}, //管理员
 	content:{type:String},//内容
 	comments_id:{type:String,default:""},
 	is_replied:{type:Boolean,default:false},// 是否已经回复,
 	created_at:{type:Date,default:Date.now()},//评论创建的时间；
 })

 module.exports=CommentsSchema;
 