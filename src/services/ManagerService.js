import * as service from './index';
import * as api from '@/constants/api';


export const add_manager=function(body){
	return service.post(api.ADD_MANAGER,body);
}

export const get_manager_list=function(opts){
	return service.post(api.GET_MANAGER_LIST,opts);
}

export const del_manager_by_id=function(id){
	return service.post(api.DEL_MANAGER_BY_ID,{id:id})
}

export const get_manager_by_id=function(id){
	return service.post(api.GET_MANAGER_BY_ID,{id:id})
}