var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.Types.ObjectId;   


 const TagSchema = new Schema({
 	tagName:{type:String,index:{unique:true}},
 	color:{type:String,default:"red"},
 	bgcolor:{type:String,default:"#fff"},
 	created_at:{type:Date,default:Date.now()},
 })

 module.exports=TagSchema;
 