<template>
  <div id="app">
    <v-app>
      <Header />
      <router-view />
      <Back />
      <Alerts />
    </v-app>
  </div>
</template>

<script>
import Header from "./components/Header";
import Back from "./components/helpers/Back";
import Alerts from "./components/helpers/Alerts";
const { ipcRenderer } = window.require("electron");

export default {
  name: "App",

  components: {
    Header,
    Back,
    Alerts,
  },

  created() {
    this.$store.dispatch("getNetworks");
    this.$store.dispatch("getFavorites");
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
.scroll-overflow-y {
  overflow-y: scroll;
}
</style>
