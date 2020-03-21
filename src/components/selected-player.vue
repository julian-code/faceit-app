<template>
  <v-skeleton-loader
    :loading="loading"
    :transition="transition"
    type="card"
  >
    <v-card class="pl-2">
      <v-row>
        <v-col cols="2" style="text-align: center">
          <v-avatar color="grey" size="164">
            <img :src="player.avatar" />
          </v-avatar>
          <v-list-item dark>
            <v-list-item-content>
              <v-list-item-title class="title">{{player.nickname}}</v-list-item-title>
              <v-list-item-subtitle>Level: {{player.csgo_skill_level}}</v-list-item-subtitle>
              <v-list-item-subtitle>ELO: {{player.games.csgo.faceit_elo}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="10">
          <v-card class="pr-2 pl-2 mt-0" elevation="0">
            <v-row>
              <v-col>
                <v-card>
                  <v-card-text class="text-center">
                    <p class="dispay-1 text--primary">Maps played:</p>
                    <p class="text--primary">{{player.stats.m1}}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-card>
                  <v-card-text class="text-center">
                    <p class="dispay-1 text--primary">Win %:</p>
                    <p class="text--primary">{{player.stats.k6}}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-card>
                  <v-card-text class="text-center">
                    <p class="dispay-1 text--primary">Average K/D:</p>
                    <p class="text--primary">{{player.stats.k5}}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-card>
                  <v-card-text class="text-center">
                    <p class="dispay-1 text--primary">Average HS %:</p>
                    <p class="text--primary">{{player.stats.k8}}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-card>
                  <v-card-text class="text-center">
                    <p class="dispay-1 text--primary">5 recent matches:</p>
                    <p
                      class="text--primary"
                    >{{recentResults.wins}} Win(s), {{recentResults.losses}} Loss(es)</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-card>
                  <v-card-text class="text-center">
                    <p class="dispay-1 text--primary">Longest win streak:</p>
                    <p class="text--primary">{{player.stats.s2}}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  :loading="loading"
                  :headers="headers"
                  :items="player.matches"
                  @click:row="openMatch"
                >
                  <template v-slot:item.win="{ item }">
                    <v-chip v-if="item.win" color="green" dark>WIN</v-chip>
                    <v-chip v-else color="red" dark>LOSS</v-chip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      tab: null,
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
          text: 'Elo',
          value: 'elo',
        },
        {
          text: 'Kills',
          value: 'kills',
        },
        {
          text: 'Assists',
          value: 'assists',
        },
        {
          text: 'Deaths',
          value: 'deaths',
        },
        {
          text: 'K/R',
          value: 'killPerRound',
        },
        {
          text: 'K/D',
          value: 'kd',
        },
        {
          text: 'Played at',
          value: 'time',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.isLoading,
    }),
    recentResults() {
      const total = this.player.stats.s0.reduce(
        (match1, match2) => Number(match1) + Number(match2),
        0,
      );
      return { wins: total, losses: 5 - total };
    },
  },
  props: {
    player: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openMatch(match) {
      window.open(
        `https://www.faceit.com/en/csgo/room/${match.matchId}`,
        '_blank',
      );
    },
  },
};
</script>
