import * as service from './index';
import * as api from '@/constants/api';


export const add_cate=function(body){
	return service.post(api.ADD_CATE,body);
}

export const get_cate_list=function(opts){
	return service.post(api.GET_CATE_LIST,opts);
}

export const del_cate_by_id=function(id){
	return service.post(api.DEL_CATE_BY_ID,{id:id})
}

export const get_cate_by_id=function(id){
	return service.post(api.GET_CATE_BY_ID,{id:id})
}

export const save_cate=function(obj){
	return service.post(api.SAVE_CATE,obj);
}