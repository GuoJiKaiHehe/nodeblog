import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import getters from './getters';
import actions from './actions';
import state from './state';
import mutations from './mutations';

export default new Vuex.Store({
	getters,
	actions,
	state,
	mutations
})