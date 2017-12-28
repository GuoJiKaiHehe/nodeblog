var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.Types.ObjectId;   


 const CateSchema = new Schema({
 	cateName:{type:String,index:{unique:true}},
 	isHot:{type:Boolean,default:false},
 	pid:{type:String},
 	level:{type:Number},//分类等级
 	created_at:{type:Date,default:Date.now()},
 	updated_at:{type:Date,default:Date.now()}
 })

 module.exports=CateSchema;
 