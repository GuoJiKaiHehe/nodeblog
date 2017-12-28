import {
	LOGIN
} from '../constants/action';

const mutations={
 	INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    [LOGIN](state,admin){
		state.admin=admin;
    }
}

export default mutations;