<template>
  <v-card>
    <v-app-bar
      app
      absolute
      color="#fcb69f"
      dark
      clipped-left
      shrink-on-scroll
      :src="picture"
      scroll-target="#scrolling-techniques-2"
    >
      <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <template v-slot:img="{ props }">
      <v-img v-bind="props" :gradient="gradient"></v-img>
    </template>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import { ACTIONS } from '../store/constants';

export default {
  data() {
    return {
      picture:
        'https://support.faceit.com/hc/article_attachments/115000545584/FPL_-_Pro.jpg',
      gradient: 'to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)',
    };
  },
  methods: {
    ...mapActions({
      toggleDrawer: ACTIONS.TOGGLE_DRAWER,
    }),
  },
};
</script>
