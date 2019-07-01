<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline">
        <span>FRIDGER</span>
        <span class="font-weight-light">PRO</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list>
        <v-list-tile v-for="npath in nav" :key="npath.title" :to="npath.path">
          <v-list-tile-content>
            <v-list-tile-title>{{ npath.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      drawer: false,
      nav: [
        { title: "Home", path: "/" },
        { title: "Stored Food", path: "/storage" },
        { title: "Known Food List", path: "/allknownfoods" }
      ]
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
</style>

