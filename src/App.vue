<template>
  <v-app id="app">
    <Header />
    <router-view />
  </v-app>
</template>

<script>
import Header from "./components/Header";
const { ipcRenderer } = window.require("electron");

export default {
  name: "App",

  components: {
    Header,
  },

  created() {
    this.$store.dispatch("getNetworks");

    ipcRenderer.send("get-dark-mode");
    ipcRenderer.on("dark-mode", (event, arg) => {
      this.$store.commit("storeDarkMode", arg);
      this.$vuetify.theme.dark = arg;
    });

    this.$store.dispatch("getCurrentAuthToken");
  },
};
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  /* -webkit-font-smoothing: antialiased; */
  /* -moz-osx-font-smoothing: grayscale; */
  text-align: center;
}
</style>
