var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    ,ObjectId = Schema.Types.ObjectId;   


 const UserSchema = new Schema({
 	account:{type:String,index:{unique:true}},
 	password:{type:String},
 	nickname:{type:String,default:"匿名用户"},
 	email:{type:String},
 	avatar:{type:String}, //头像
 	phone:{type:String,default:""},
 	sex:{type:Number,default:1},//
 	created_at:{type:Date,default:Date.now()},
 	updated_at:{type:Date,default:Date.now()}
 })

 module.exports=UserSchema;
 