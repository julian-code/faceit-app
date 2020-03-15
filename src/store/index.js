import Vue from 'vue';
import Vuex from 'vuex';
import { ACTIONS, MUTATIONS } from './constants';

Vue.use(Vuex);

async function getPlayerProfile(playerName) {
  const response = await fetch(`https://api.faceit.com/core/v1/nicknames/${playerName}`);
  const data = await response.json();
  const player = data.payload;
  const response2 = await fetch(`https://api.faceit.com/stats/api/v1/stats/users/${player.guid}/games/csgo`);
  const stats = await response2.json();
  player.stats = stats.lifetime;
  return player;
}

export default new Vuex.Store({
  state: {
    drawer: false,
    selectedPlayers: [],
  },
  mutations: {
    [MUTATIONS.SET_DRAWER](state, payload) {
      state.drawer = payload;
    },
    [MUTATIONS.SET_SELECTED_PLAYERS](state, payload) {
      state.selectedPlayers = payload;
    },
    [MUTATIONS.REMOVE_SELECTED_PLAYER](state, payload) {
      const foundPlayer = state.selectedPlayers.filter((item) => item.guid === payload)[0] || null;
      const index = state.selectedPlayers.indexOf(foundPlayer);
      if (index >= 0) state.selectedPlayers.splice(index, 1);
    },
  },
  actions: {
    [ACTIONS.TOGGLE_DRAWER](ctx) {
      ctx.commit(MUTATIONS.SET_DRAWER, !this.state.drawer);
    },
    async [ACTIONS.SET_SELECTED_PLAYERS](ctx, payload) {
      const results = [];
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < payload.length; index++) {
        const element = payload[index];
        results.push(getPlayerProfile(element));
      }
      ctx.commit(MUTATIONS.SET_SELECTED_PLAYERS, await Promise.all(results));
    },
    [ACTIONS.REMOVE_SELECTED_PLAYER](ctx, payload) {
      ctx.commit(MUTATIONS.REMOVE_SELECTED_PLAYER, payload);
    },
  },
  modules: {
  },
});
