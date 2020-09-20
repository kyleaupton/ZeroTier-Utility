import Vue from "vue";
import Vuex from "vuex";
const { ipcRenderer } = window.require("electron");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    meta: {
      darkMode: true,
    },
    currentAuthToken: "",
    allNetworks: {
      items: null,
      loaded: false,
    },
    favorites: [],
    alerts: [],
  },

  mutations: {
    storeDarkMode(state, darkMode) {
      state.meta.darkMode = darkMode;
    },

    storeNetworks(state, networks) {
      state.allNetworks.items = networks;
      state.allNetworks.loaded = true;
    },

    storeFavorites(state, favorites) {
      state.favorites = favorites;
    },

    storeCurrentAuthToken(state, currentAuthToken) {
      this.state.currentAuthToken = currentAuthToken;
    },

    storeAlert(state, alert) {
      state.alerts.push(alert);
      setTimeout(() => {
        state.alerts.pop();
      }, 1500);
    },
  },

  actions: {
    getNetworks(context) {
      ipcRenderer.on("bootstrap-resopnse", (event, arg) => {
        console.log(arg);
        context.commit("storeNetworks", arg);
      });
      ipcRenderer.send("bootstrap");
    },

    getFavorites(context) {
      context.commit("storeFavorites", ipcRenderer.sendSync("get-favorites"));
    },

    addFavorite(context, favorite) {
      ipcRenderer.sendSync("add-favorite", favorite);
      context.dispatch("getFavorites");
    },

    removeFavorite(context, favorite) {
      ipcRenderer.sendSync("remove-favorite", favorite);
      context.dispatch("getFavorites");
    },

    getCurrentAuthToken(context) {
      context.commit(
        "storeCurrentAuthToken",
        ipcRenderer.sendSync("get-current-authtoken")
      );
    },

    setCurrentAuthToken(context, authtoken) {
      ipcRenderer.sendSync("set-current-authtoken", authtoken);
      context.dispatch("getCurrentAuthToken");
    },

    addAuthToken(context, authtoken) {
      ipcRenderer.sendSync("add-authtoken", authtoken);
      context.dispatch("getCurrentAuthToken");
    },

    removeAuthToken(context, authtoken) {
      ipcRenderer.sendSync("remove-authtoken", authtoken);
      context.dispatch("getCurrentAuthToken");
    },

    addAlert(context, alert) {
      context.commit("storeAlert", alert);
    },
  },
});
