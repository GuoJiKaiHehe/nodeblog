import * as service from './index';
import * as api from '@/constants/api';


export const add_blog=function(body){
	return service.post(api.ADD_BLOG,body);
}

export const get_blog_list=function(opts){
	return service.post(api.GET_BLOG_LIST,opts);
}

export const del_blog_by_id=function(id){
	return service.post(api.DEL_BLOG_BY_ID,{id:id})
}

export const get_blog_by_id=function(id){
	return service.post(api.GET_BLOG_BY_ID,{id:id})
}

export const save_blog=function(obj){
	return service.post(api.SAVE_BLOG,obj);
}

export const upload_blog_img=function(obj){
	return service.post(api.UPLOAD_BLOG_IMG,obj,{
		headers:{'Content-Type':'multipart/form-data'}
	});
}