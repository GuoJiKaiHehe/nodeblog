//test
export const getCount = state => {
    return state.count
}

const getters={
	getCount(state){
		return state.count;
	}

}
export default getters;