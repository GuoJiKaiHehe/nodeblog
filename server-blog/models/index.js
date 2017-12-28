const mongoose=require("mongoose");
const config = require("../config");
const BlogModel=require("./BlogModel");
const UserModel=require("./UserModel");
const CateModel=require("./CateModel");
const TagModel=require("./TagModel");
mongoose.connect(config.DB_URL);

mongoose.connection.on("connected",()=>{
	console.log("connected")
});

mongoose.connection.on("error",()=>{
	console.log('error');
});

mongoose.connection.on("disconnection",()=>{
	console.log("disconnection");
});


module.exports={
	BlogModel,
	UserModel,
	CateModel,
	TagModel
}