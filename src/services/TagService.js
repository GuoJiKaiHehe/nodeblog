import * as service from './index';
import * as api from '@/constants/api';


export const add_tag=function(body){
	return service.post(api.ADD_TAG,body);
}

export const get_tag_list=function(opts){
	return service.post(api.GET_TAG_LIST,opts);
}

export const del_tag_by_id=function(id){
	return service.post(api.DEL_TAG_BY_ID,{id:id})
}

export const get_tag_by_id=function(id){
	return service.post(api.GET_TAG_BY_ID,{id:id})
}

export const save_tag=function(obj){
	return service.post(api.SAVE_TAG,obj);
}