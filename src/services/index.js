import axios from 'axios';


let instance = axios.create({
	headers:{'custom-token':'guojikai'},
});

export const get=function(url,params,headers={}){
	return instance({
		method:"get",
		url:url,
		params:params,
		headers:headers
	})
}


export const post=function(url,body={},opts={}){
	return instance({
		method:"post",
		url:url,
		data:body,
		...opts
	});

}


instance.interceptors.request.use((config)=>{
	return config;
},(err)=>{
	return Promise.reject(err);
});

instance.interceptors.response.use((response)=>{
	return response
},(err)=>{
	return Promise.reject(err);
});