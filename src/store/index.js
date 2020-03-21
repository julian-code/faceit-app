import Vue from 'vue';
import Vuex from 'vuex';
import { ACTIONS, MUTATIONS, GETTERS } from './constants';

Vue.use(Vuex);

async function fetchMatches(pageNumber, player) {
  const response = await fetch(
    `https://api.faceit.com/stats/v1/stats/time/users/${player.guid}/games/csgo?page=${pageNumber}&size=2000`,
  );
  const data = await response.json();
  const matches = [];
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < data.length - 1; index++) {
    const x = data[index];
    const match = {
      matchId: x.matchId,
      elo: Number(x.elo),
      eloDiff: Number(x.elo) - Number(data[index + 1].elo),
      map: x.i1,
      win: x.teamId === x.i2,
      time: x.created_at,
      kills: x.i6,
      assists: x.i7,
      deaths: x.i8,
      killPerRound: x.c3,
      kd: x.c2,
    };
    matches.push(match);
  }
  return matches;
}

async function getPlayerProfile(playerName) {
  const response = await fetch(`https://api.faceit.com/core/v1/nicknames/${playerName}`);
  const data = await response.json();
  const player = data.payload;
  const response2 = await fetch(`https://api.faceit.com/stats/api/v1/stats/users/${player.guid}/games/csgo`);
  const stats = await response2.json();
  player.stats = stats.lifetime;
  const pages = player.stats.m1 / 2000;
  const results = [];
  for (let index = 0; index < pages; index += 1) {
    results.push(fetchMatches(index, player));
  }
  const matches = await Promise.all(results);
  let matchConcat = [];
  matches.forEach((entry) => {
    if (matchConcat.length > 0) {
      matchConcat = matchConcat.concat(entry);
    } else {
      matchConcat = entry;
    }
  });
  player.matches = matchConcat;
  return player;
}

export default new Vuex.Store({
  state: {
    drawer: false,
    selectedPlayers: [],
    isLoading: false,
  },
  mutations: {
    [MUTATIONS.SET_IS_LOADING](state, payload) {
      state.isLoading = payload;
    },
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
    [ACTIONS.SET_IS_LOADING](ctx, payload) {
      ctx.commit(MUTATIONS.SET_IS_LOADING, payload);
    },
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
      ctx.commit(MUTATIONS.SET_IS_LOADING, true);
      ctx.commit(MUTATIONS.SET_SELECTED_PLAYERS, await Promise.all(results));
      ctx.commit(MUTATIONS.SET_IS_LOADING, false);
    },
    [ACTIONS.REMOVE_SELECTED_PLAYER](ctx, payload) {
      ctx.commit(MUTATIONS.REMOVE_SELECTED_PLAYER, payload);
    },
  },
  getters: {
    [GETTERS.GET_COMMON_MATCHES](ctx) {
      return ctx.state;
    },
  },
  modules: {
  },
});
