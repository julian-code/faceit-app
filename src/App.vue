<template>
  <v-app dark>

    <navigation-drawer :drawer="drawer"></navigation-drawer>

    <navigation></navigation>

    <!-- Sizes your content based upon application components -->
    <v-content>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import navigation from '@/components/navigation.vue';
import navigationDrawer from '@/components/navigation-drawer.vue';

export default {
  components: {
    navigation,
    navigationDrawer,
  },
};
</script>
