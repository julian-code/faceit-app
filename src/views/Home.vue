<template>
  <div>
    <v-row>
      <v-col>
        <follow-players></follow-players>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <selected-players></selected-players>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import followPlayers from '@/components/follow-players.vue';
import selectedPlayers from '@/components/selected-players.vue';

export default {
  components: {
    followPlayers,
    selectedPlayers,
  },
  name: 'Home',
};
</script>
