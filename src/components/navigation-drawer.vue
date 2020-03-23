<template>
    <v-navigation-drawer app :value="drawer" clipped>
      <!-- -->
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      drawer: 'drawer',
    }),
  },
};
</script>
