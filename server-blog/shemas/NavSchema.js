var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.Types.ObjectId;   


 const NavSchema = new Schema({
 	navName:{type:String,index:{unique:true}},
 	isHot:{type:Boolean,default:false},
 	color:{type:Boolean,default:'#80bd01'},
 	created_at:{type:Date,default:Date.now()},
 	updated_at:{type:Date,default:Date.now()}
 })

 module.exports=NavSchema;
 