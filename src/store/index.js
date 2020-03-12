import Vue from 'vue';
import Vuex from 'vuex';
import { ACTIONS, MUTATIONS } from './constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: false,
  },
  mutations: {
    [MUTATIONS.SET_DRAWER](state, payload) {
      state.drawer = payload;
    },
  },
  actions: {
    [ACTIONS.TOGGLE_DRAWER](ctx) {
      ctx.commit(MUTATIONS.SET_DRAWER, !this.state.drawer);
    },
  },
  modules: {
  },
});
