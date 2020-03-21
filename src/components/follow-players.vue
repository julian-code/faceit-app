<template>
  <v-card>
    <v-autocomplete
      v-model="selectedPlayers"
      @change="search = ''"
      @input="addPlayer"
      :search-input.sync="search"
      :items="items"
      :loading="isLoading"
      item-text="nickname"
      item-value="nickname"
      hide-selected
      hide-no-data
      cache-items
      multiple
      chips
      placeholder="Search by player name"
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          close
          @click="data.select"
          @click:close="remove(data.item.id)"
        >
          <v-avatar left>
            <v-img :src="data.item.avatar"></v-img>
          </v-avatar>
          {{ data.item.nickname }}
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item.nickname"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-avatar>
            <img :src="data.item.avatar" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.nickname"></v-list-item-title>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { ACTIONS } from '../store/constants';

export default {
  data() {
    return {
      players: [],
      search: null,
      items: [],
    };
  },
  computed: {
    ...mapState({
      selectedPlayers: (state) => state.selectedPlayers,
      isLoading: (state) => state.isLoading,
    }),
  },
  methods: {
    ...mapActions({
      remove: ACTIONS.REMOVE_SELECTED_PLAYER,
      addPlayer: ACTIONS.SET_SELECTED_PLAYERS,
      changeLoading: ACTIONS.SET_IS_LOADING,
    }),
    async querySelections(val) {
      if (this.isLoading) {
        return;
      }
      this.changeLoading(true);
      fetch(`https://api.faceit.com/search/v1?limit=20&query=${val}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.payload.players.results);
          this.items = res.payload.players.results;
        })
      // eslint-disable-next-line no-return-assign
        .finally(() => (this.changeLoading(false)));
    },
  },
  watch: {
    search(val) {
      // eslint-disable-next-line no-unused-expressions
      val && this.querySelections(val);
    },
  },
};
</script>
