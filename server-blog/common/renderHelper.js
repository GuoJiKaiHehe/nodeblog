const moment= require("moment");
const timeago= require("timeago.js");

var timeagoInstance = new timeago("zh_CN");
// timeagoInstance.format('2016-06-12', 'zh_CN');
// var timeagoInstance=  new timeago().setLocale("zh_CN");
// console.log(timeagoInstance.format(new Date()));
exports.stringify=function(obj){
	return JSON.stringify(obj);
}
exports.timeagoInstance=timeagoInstance;

exports.moment=moment;