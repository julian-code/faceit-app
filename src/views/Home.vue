<template>
  <div>
    <v-row>
      <v-col>
        <follow-players></follow-players>
      </v-col>
      <v-col>
        <v-card title="123">
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import followPlayers from '@/components/follow-players.vue';

export default {
  components: {
    followPlayers,
  },
  name: 'Home',
};
</script>
