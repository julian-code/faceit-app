<template>
  <v-card deck v-if="selectedPlayers.length > 1">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Select players to compare</v-card-title>
          <v-card-text>
            <v-chip-group multiple>
              <v-chip
                v-for="player in selectedPlayers" :key="player.nickname"
                v-bind="player"
                @input="addOrRemovePlayerToCompare(player)"
                :filter="player.isActive"
              >
                <v-avatar left>
                  <v-img :src="player.avatar"></v-img>
                </v-avatar>
                {{ player.nickname }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="playersToCompare.length > 1">
      <v-col>
        <v-card>
          <v-card-title>Map stats</v-card-title>
          <v-data-table hide-default-footer :headers="headers2" :items="mapStats.groupedMatches">
            <template v-slot:item.winsLosses="{ item }">{{item.wins}} / {{item.losses}}</template>
            <template
              v-slot:item.winProcentLossProcent="{ item }"
            >{{item.winProcent}}% / {{(100 - item.winProcent).toFixed(2)}}%</template>
            <template v-slot:body.append>
              <tr>
                <td>Totals</td>
                <td>{{mapStats.totalStats.totalMapPlayed}}</td>
                <td>{{mapStats.totalStats.totalWins}} / {{mapStats.totalStats.totalLosses}}</td>
                <td>
                  {{mapStats.totalStats.totalWinProcent}}%
                  / {{(100 - mapStats.totalStats.totalWinProcent).toFixed(2)}}%
                </td>
                <td>{{mapStats.totalStats.totalEloGain}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>All common matches</v-card-title>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="commonMatches"
            @click:row="openMatch"
          >
            <template v-slot:item.win="{ item }">
              <v-chip v-if="item.win" color="green" dark>WIN</v-chip>
              <v-chip v-else color="red" dark>LOSS</v-chip>
            </template>
            <template v-slot:item.eloDiff="{ item }">
              <p v-if="item.eloDiff === NaN">No elo match</p>
              <p v-else>{{ item.eloDiff }}</p>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
  <v-card v-else>
    <v-card-text>Please select more than one player to see common matches.</v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { GETTERS, ACTIONS } from '../store/constants';

export default {
  data() {
    return {
      matches: [],
      headers: [
        {
          text: 'Map',
          value: 'map',
        },
        {
          text: 'Win',
          value: 'win',
        },
        {
          text: 'Elo loss/gain',
          value: 'eloDiff',
        },
      ],
      headers2: [
        {
          text: 'Map',
          value: 'map',
        },
        {
          text: 'Total played',
          value: 'totalPlayed',
        },
        {
          text: 'Wins / losses',
          value: 'winsLosses',
        },
        {
          text: 'Win % / loss %',
          value: 'winProcentLossProcent',
        },
        {
          text: 'Elo gain',
          value: 'totalEloGained',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      commonMatches: GETTERS.GET_COMMON_MATCHES,
      mapStats: GETTERS.GET_MAP_STATS,
    }),
    ...mapState({
      playersToCompare: (state) => state.playersToCompare,
      selectedPlayers: (state) => state.selectedPlayers,
    }),
  },
  methods: {
    ...mapActions({
      addOrRemovePlayerToCompare: ACTIONS.ADD_OR_REMOVE_PLAYER_TO_COMPARE,
    }),
    openMatch(match) {
      window.open(
        `https://www.faceit.com/en/csgo/room/${match.matchId}`,
        '_blank',
      );
    },
  },
};
</script>
