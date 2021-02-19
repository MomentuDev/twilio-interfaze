<template>
  <v-app app>
    <nav-bar></nav-bar>
    <v-main>     
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
    <home-footer></home-footer>
  </v-app>
</template>

<script>
import navBar from './components/navBar.vue';
import homeFooter from './components/footer.vue';

export default {
  components: {
    navBar,
    homeFooter,
  },
};
</script>
