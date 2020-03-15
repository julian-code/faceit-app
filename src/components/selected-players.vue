<template>
<v-card>
    <v-tabs
    v-model="tab"
    >
        <v-tab
        v-for="selectedPlayer in selectedPlayers" :key="selectedPlayer.guid">
        {{selectedPlayer.nickname}}
        </v-tab>
        <v-tabs-items v-model="tab">
            <v-tab-item
            v-for="selectedPlayer in selectedPlayers"
            :key="selectedPlayer.guid"
            >
                <selected-player :player="selectedPlayer"></selected-player>
            </v-tab-item>
        </v-tabs-items>
    </v-tabs>
</v-card>
</template>

<script>
import { mapState } from 'vuex';
import selectedPlayer from '@/components/selected-player.vue';

export default {
  components: {
    selectedPlayer,
  },
  data() {
    return {
      tab: null,
    };
  },
  computed: {
    ...mapState({
      selectedPlayers: (state) => state.selectedPlayers,
    }),
  },
};
</script>

<style lang="scss" scoped>

</style>
