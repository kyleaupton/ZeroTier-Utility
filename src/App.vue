<template>
  <div id="app" :class="{ darkMode: darkMode }">
    <v-app>
      <Header v-if="!showInit" />
      <v-main class="app-main">
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
      this.$store.dispatch("getLastRefreshed");
      const now = new Date();
      const time = now.getTime();
      if (time > this.$store.state.lastRefreshed + 120000) {
        this.$store.dispatch("refresh");
      }
    }, 5000);

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
  /* colors */
  --color-primary: #077bff;
  --color-secondary: #f8f9fa;
  --color-light: white;
  --color-dark: black;

  /* background colors */
  --color-background-hover: rgba(0, 0, 0, 0.1);
  --color-background-active: rgba(0, 0, 0, 0.5);
  --color-background-peer-notPeer: rgba(191, 63, 63, 0.3);

  /* border colors */
  --color-border: black;
  --color-border-primary: rgba(0, 0, 0, 0.3);
  --color-border-primary-hover: rgba(0, 0, 0, 0.5);
  --color-border-primary-active: rgba(0, 0, 0, 1);

  /* input */
  --color-caret-primary: black;
  --color-text-primary: black;

  /* animation */
  --transition-primary: 0.2s;
}

.darkMode {
  /* colors */
  --color-primary: #077bff;
  --color-secondary: #292b2c;
  --color-light: black;
  --color-dark: white;

  /* background colors */
  --color-background-hover: rgba(255, 255, 255, 0.1);
  --color-background-active: rgba(255, 255, 255, 0.5);

  /* border colors*/
  --color-border: white;
  --color-border-primary: rgba(255, 255, 255, 0.3);
  --color-border-primary-hover: rgba(255, 255, 255, 0.55);
  --color-border-primary-active: rgba(255, 255, 255, 1);

  /* input */
  --color-caret-primary: white;
  --color-text-primary: white;
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
