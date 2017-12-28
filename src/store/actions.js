import {
	LOGIN
} from '../constants/action';
//test
/*export const increment = ({commit}) => {
    commit('INCREMENT')
}
export const decrement = ({commit}) => {
    commit('DECREMENT')
}

export const LOGIN=({commit})=>{

}*/

const actions={
	[LOGIN]({commit},admin){
		sessionStorage.admin=JSON.stringify(admin);
		commit(LOGIN,admin);
	},
	decrement({commit}){
		 commit('DECREMENT')
	},
	increment({commit}){
		commit('INCREMENT')
	}
}

export default actions;