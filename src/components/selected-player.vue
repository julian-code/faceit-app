<template>
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
              <v-data-table :items="matches"></v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      tab: null,
      entries: [],
    };
  },
  computed: {
    recentResults() {
      const total = this.player.stats.s0.reduce(
        (match1, match2) => Number(match1) + Number(match2),
        0,
      );
      return { wins: total, losses: 5 - total };
    },
    matches() {
      let matchConcat = [];
      this.entries.forEach((entry) => {
        if (matchConcat.length > 0) {
          matchConcat = matchConcat.concat(entry);
        } else {
          matchConcat = entry;
        }
      });
      return matchConcat;
    },
  },
  async created() {
    await this.getMatches();
  },
  props: {
    player: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async getMatches() {
      const pages = this.player.stats.m1 / 2000;
      console.log(pages);
      const results = [];
      for (let index = 0; index < pages; index += 1) {
        results.push(this.fetchMatches(index));
      }
      this.entries = await Promise.all(results);
    },
    async fetchMatches(pageNumber) {
      const response = await fetch(`https://api.faceit.com/stats/v1/stats/time/users/${this.player.guid}/games/csgo?page=${pageNumber}&size=2000`);
      const data = response.json();
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
