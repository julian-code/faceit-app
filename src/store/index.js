/* eslint-disable max-len */
import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { ACTIONS, MUTATIONS, GETTERS } from './constants';

Vue.use(Vuex);

function amountOfWins(matches) {
  let totalWins = 0;
  matches.forEach((match) => {
    if (match.win) {
      totalWins += 1;
    }
  });
  return totalWins;
}

async function fetchMatches(pageNumber, player) {
  const response = await fetch(
    `https://api.faceit.com/stats/v1/stats/time/users/${player.guid}/games/csgo?page=${pageNumber}&size=2000`,
  );
  const data = await response.json();
  const matches = [];
  const faultyMatches = [];
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < data.length - 1; index++) {
    const x = data[index];
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(x.elo)) {
      faultyMatches.push(x);
      // eslint-disable-next-line no-continue
      continue;
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(x.elo) - Number(data[index + 1].elo))) {
      faultyMatches.push(x);
      // eslint-disable-next-line no-continue
      continue;
    }
    const match = {
      matchId: x.matchId,
      teamName: x.i5,
      elo: Number(x.elo),
      eloDiff: Number(x.elo) - Number(data[index + 1].elo),
      map: x.i1,
      win: x.teamId === x.i2,
      time: new Date(x.created_at).toLocaleString(),
      kills: x.i6,
      assists: x.i7,
      deaths: x.i8,
      killPerRound: x.c3,
      kd: x.c2,
    };
    matches.push(match);
  }
  return { matches, faultyMatches };
}

async function getPlayerProfile(playerName) {
  const response = await fetch(`https://api.faceit.com/core/v1/nicknames/${playerName}`);
  const data = await response.json();
  const player = data.payload;
  player.isCompared = false;
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
      matchConcat = matchConcat.concat(entry.matches);
    } else {
      matchConcat = entry.matches;
    }
  });
  player.matches = matchConcat;
  player.faultyMatches = matches.faultyMatches;
  return player;
}

export default new Vuex.Store({
  state: {
    drawer: false,
    selectedPlayers: [],
    playersToCompare: [],
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
    [MUTATIONS.ADD_PLAYER_TO_COMPARE](state, payload) {
      const indexOfPlayer = _.findIndex(state.selectedPlayers, (player) => player.nickname === payload.nickname);
      state.selectedPlayers[indexOfPlayer].isCompared = true;
      state.playersToCompare.push(payload);
    },
    [MUTATIONS.REMOVE_PLAYER_TO_COMPARE](state, payload) {
      const indexOfPlayer = _.findIndex(state.selectedPlayers, (player) => player.nickname === payload.nickname);
      state.selectedPlayers[indexOfPlayer].isCompared = false;
      state.playersToCompare = _.without(state.playersToCompare, payload);
    },
    [MUTATIONS.CLEAR_PLAYERS_TO_COMPARE](state) {
      state.selectedPlayers = _.map(state.selectedPlayers, (player) => _.set(player, 'isCompared', false));
      state.playersToCompare = [];
    },
  },
  actions: {
    [ACTIONS.ADD_OR_REMOVE_PLAYER_TO_COMPARE](ctx, payload) {
      const foundPlayer = _.findIndex(ctx.state.playersToCompare, (player) => player.guid === payload.guid);
      if (foundPlayer < 0) {
        const player = payload;
        player.isCompared = true;
        ctx.commit(MUTATIONS.ADD_PLAYER_TO_COMPARE, payload);
      } else {
        ctx.commit(MUTATIONS.REMOVE_PLAYER_TO_COMPARE, payload);
      }
    },
    [ACTIONS.SET_IS_LOADING](ctx, payload) {
      ctx.commit(MUTATIONS.SET_IS_LOADING, payload);
    },
    [ACTIONS.TOGGLE_DRAWER](ctx) {
      ctx.commit(MUTATIONS.SET_DRAWER, !ctx.state.drawer);
    },
    async [ACTIONS.SET_SELECTED_PLAYERS](ctx, payload) {
      ctx.commit(MUTATIONS.CLEAR_PLAYERS_TO_COMPARE);
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
      const allMatches = [];
      if (!ctx.playersToCompare.length === 1) {
        return [];
      }
      ctx.playersToCompare.forEach((player) => {
        const comparableMatches = player.matches.map((match) => ({
          teamName: match.teamName,
          matchId: match.matchId,
          eloDiff: match.eloDiff,
          map: match.map,
          win: match.win,
          time: new Date(match.time),
        }));
        allMatches.push(comparableMatches);
      });
      return _.intersectionWith(...allMatches,
        (match1, match2) => {
          if (match1.win === match2.win && match1.matchId === match2.matchId) {
            return true;
          }
          return false;
        });
    },
    [GETTERS.GET_MAP_STATS](ctx, getters) {
      const commonMatches = getters.GET_COMMON_MATCHES;
      const groupedMatches = _.chain(commonMatches)
        .groupBy('map')
        .map((matches, map) => (
          { map, matches }))
        .map((matchGroup) => ({
          map: matchGroup.map,
          totalPlayed: matchGroup.matches.length,
          totalEloGained: _.reduce(matchGroup.matches, (sum, match) => sum + match.eloDiff, 0),
          wins: _.sumBy(matchGroup.matches, (match) => { if (match.win) return 1; return 0; }),
          losses: _.sumBy(matchGroup.matches, (match) => { if (!match.win) return 1; return 0; }),
          winProcent: Number(((amountOfWins(matchGroup.matches) / (matchGroup.matches.length)) * 100)
            .toFixed(2)),
        }))
        .value();
      const totalStats = {
        totalMapPlayed: _.reduce(groupedMatches, (sum, groupedMatch) => sum + groupedMatch.totalPlayed, 0),
        totalEloGain: _.reduce(groupedMatches, (sum, groupedMatch) => sum + groupedMatch.totalEloGained, 0),
        totalWins: _.reduce(groupedMatches, (sum, groupedMatch) => sum + groupedMatch.wins, 0),
        totalLosses: _.reduce(groupedMatches, (sum, groupedMatch) => sum + groupedMatch.losses, 0),
        totalWinProcent: (_.reduce(groupedMatches, (sum, groupedMatch) => sum + groupedMatch.winProcent, 0) / groupedMatches.length).toFixed(2),
      };
      return { groupedMatches: _.orderBy(groupedMatches, ['wins', 'winProcent', 'totalEloGained'], ['desc', 'desc', 'desc']), totalStats };
    },
  },
  modules: {
  },
});
