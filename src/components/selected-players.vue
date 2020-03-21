<template>
  <v-card>
    <v-tabs v-model="currentTab">
      <v-tab
      v-for="tab in tabs" :key="tab.title"
      >{{tab.title}}</v-tab>
      <v-tab-item v-for="tab in tabs" :key="tab.title">
          <component
            v-bind:is="tab.component"
            v-bind="tab.value"
          >
          </component>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import selectedPlayer from '@/components/selected-player.vue';
import commonMatches from '@/components/common-matches.vue';

export default {
  components: {
    selectedPlayer,
    commonMatches,
  },
  data() {
    return {
      currentTab: null,
    };
  },
  computed: {
    ...mapState({
      selectedPlayers: (state) => state.selectedPlayers,
    }),
    tabs() {
      const fixedTabs = [
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
      return fixedTabs.concat(...playerTabs);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
