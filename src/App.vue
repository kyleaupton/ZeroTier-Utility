<template>
  <div id="app" :class="{ darkMode: darkMode }">
    <v-app>
      <Header v-if="!showInit" />
      <v-main class="app-main">
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
import "tippy.js/dist/tippy.css";

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
    // Show init page
    this.$store.commit(
      "storeShowInit",
      !this.$store.state.currentAuthToken.length
    );

    // Get current authtoken
    this.$store.dispatch("getCurrentAuthToken"); // This is the entry point for bootstraping.

    // Get dark mode
    ipcRenderer.send("get-dark-mode");
    ipcRenderer.on("dark-mode", (event, arg) => {
      this.$store.commit("storeDarkMode", arg);
      this.$vuetify.theme.dark = arg;
    });

    // Setting the interval for refreshing
    setInterval(() => {
      this.$store.dispatch("refresh");
    }, 120000);

    // Updates
    ipcRenderer.on("update-available", (event, arg) => {
      this.$store.commit("storeUpdateAvail", arg);
    });
    ipcRenderer.on("update-not-available", () => {
      this.$store.dispatch("addAlert", {
        text: "No updates available.",
        type: "info",
      });
    });
    ipcRenderer.on("update-is-available", () => {
      this.$store.dispatch("addAlert", {
        text: "Downloading update...",
        type: "info",
      });
    });
    ipcRenderer.on("update-checking", () => {
      this.$store.dispatch("addAlert", {
        text: "Checking for updates...",
        type: "info",
      });
    });
  },

  computed: {
    darkMode() {
      return this.$store.state.meta.darkMode;
    },

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
#app {
  font-family: sans-serif;
}

:root {
  /* background colors */
  --color-dark: black;
  --color-background-hover: rgba(0, 0, 0, 0.1);
  --color-background-active: rgba(0, 0, 0, 0.5);
  --color-background-peer-notPeer: rgba(191, 63, 63, 0.3);

  /* border colors */
  --color-border: black;
}

.darkMode {
  /* background colors */
  --color-dark: white;
  --color-background-hover: rgba(255, 255, 255, 0.1);
  --color-background-active: rgba(255, 255, 255, 0.5);

  /* border colors*/
  --color-border: white;
}

::-webkit-scrollbar {
  width: 0px;
}

.app-main {
  margin: 8px;
}

.tippy-box[data-theme~="custom"] {
  font-family: sans-serif;
}
</style>
