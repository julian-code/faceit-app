<template>
  <v-card>
    <v-tabs v-model="currentTab">
      <v-tab v-for="tab in tabs" :key="tab.title">{{tab.title}}</v-tab>
      <v-tab-item v-for="tab in tabs" :key="tab.title">
        <component v-bind:is="tab.component" v-bind="tab.value"></component>
      </v-tab-item>
      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn elevation="0" v-on="on" class="align-self-center mr-4" :loading="isLoading">
            add player
            <v-icon right>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <follow-players></follow-players>
        </v-card>
      </v-menu>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import selectedPlayer from '@/components/selected-player.vue';
import commonMatches from '@/components/common-matches.vue';
import followPlayers from '@/components/follow-players.vue';

export default {
  components: {
    selectedPlayer,
    commonMatches,
    followPlayers,
  },
  data() {
    return {
      currentTab: null,
    };
  },
  computed: {
    ...mapState({
      selectedPlayers: (state) => state.selectedPlayers,
      isLoading: (state) => state.isLoading,
    }),
    tabs() {
      const fixedTabsLeft = [
        {
          title: 'Common matches',
          value: null,
          component: 'common-matches',
        },
      ];
      const playerTabs = this.selectedPlayers.map((player) => ({
        title: player.nickname,
        value: { player },
        component: 'selected-player',
      }));
      return fixedTabsLeft.concat(...playerTabs);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
