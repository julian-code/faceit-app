<template>
  <v-card>
    <v-autocomplete
        v-model="selectedPlayers"
        :search-input.sync="search"
        :items="players"
        :loading="isLoading"
        solo-inverted
        multiple
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:colose="remove(data.item)">
              <v-avatar left>
                <v-img :src="data.item.avatar"></v-img>
              </v-avatar>
              {{data.item.nickname}}
            </v-chip>
          </template>
          <template v-slot:item="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-item-content v-text="data.item"></v-list-item-content>
                </template>
                <template v-else>
                  <v-list-item-avatar>
                    <img :src="data.item.avatar">
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.nickname"></v-list-item-title>
                    <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </template>
        </v-autocomplete>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      selectedPlayers: [],
      players: [],
      search: null,
      isLoading: false,
    };
  },
  watch: {
    search(val) {
      if (!this.search) {
        return;
      }
      this.isLoading = true;
      fetch(`https://api.faceit.com/search/v1?limit=20&query=${val}`)
        .then((res) => res.json())
        .then((res) => {
          this.players = res.payload.players.results;
        })
        // eslint-disable-next-line no-return-assign
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>
