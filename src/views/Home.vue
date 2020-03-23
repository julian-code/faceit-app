<template>
    <v-row>
      <v-col>
        <selected-players></selected-players>
      </v-col>
    </v-row>
</template>

<script>
import selectedPlayers from '@/components/selected-players.vue';

export default {
  components: {
    selectedPlayers,
  },
  name: 'Home',
};
</script>
