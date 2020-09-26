<template>
  <div id="app">
    <v-app>
      <Header v-if="!showInit" />
      <v-main>
        <Update v-if="updateAvail" />
        <component :is="component" />
      </v-main>
      <Alerts />
    </v-app>
  </div>
</template>

<script>
import Header from "./components/Header";
import Back from "./components/helpers/Back";
import Alerts from "./components/helpers/Alerts";
import NewAuthtoken from "./views/NewAuthtoken";
import Update from "./components/helpers/Update";
const { ipcRenderer } = window.require("electron");

export default {
  name: "App",

  components: {
    Header,
    Back,
    Alerts,
    NewAuthtoken,
    Update,
  },

  created() {
    this.$store.commit(
      "storeShowInit",
      !this.$store.state.currentAuthToken.length
    );
    this.$store.dispatch("getCurrentAuthToken"); // This is the entry point for bootstraping.
    ipcRenderer.send("get-dark-mode");
    ipcRenderer.on("dark-mode", (event, arg) => {
      this.$store.commit("storeDarkMode", arg);
      this.$vuetify.theme.dark = arg;
    });
    // Setting the interval for refreshing
    setInterval(() => {
      console.log("got to interval");
      this.$store.dispatch("refresh");
    }, 120000);

    // Updating
    ipcRenderer.on("update-available", (event, arg) => {
      this.$store.commit("storeUpdateAvail", arg);
    });
  },

  computed: {
    component() {
      return this.$store.state.showInit ? "NewAuthtoken" : "router-view";
    },

    currentAuthToken() {
      return this.$store.state.currentAuthToken;
    },

    showInit() {
      return this.$store.state.showInit;
    },

    showBack() {
      return this.$route.meta.showBack;
    },

    updateAvail() {
      return this.$store.state.meta.updateAvailable;
    },
  },

  watch: {
    currentAuthToken() {
      this.$store.commit(
        "storeShowInit",
        !this.$store.state.currentAuthToken.length
      );
      // Only need to bootstrap on startup and when currentAuthToken changes.
      this.$store.dispatch("bootstrap");
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 0px;
}
</style>
