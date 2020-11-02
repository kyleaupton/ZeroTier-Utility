import Vue from "vue";
import Vuex from "vuex";
import crypto from "crypto";
const { ipcRenderer } = window.require("electron");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    meta: {
      darkMode: true,
      errorState: {
        error: false,
        status: "",
        statusText: "",
      },
      updateAvailable: true,
      dashboardNetworksView: "my-networks",
    },
    currentAuthToken: "",
    allAuthTokens: [],
    allNetworks: {
      items: [],
      loaded: false,
    },
    lastRefreshed: "",
    favorites: [],
    alerts: [],
    showInit: false,
  },

  mutations: {
    storeDarkMode(state, darkMode) {
      state.meta.darkMode = darkMode;
    },

    storeShowInit(state, arg) {
      state.showInit = arg;
    },

    storeNetworks(state, networks) {
      state.allNetworks.items = networks;
      state.allNetworks.loaded = true;
    },

    resetNetworks(state) {
      // state.allNetworks.items = [];
      state.allNetworks.loaded = false;
    },

    storeFavorites(state, favorites) {
      state.favorites = favorites;
    },

    storeCurrentAuthToken(state, currentAuthToken) {
      state.currentAuthToken = currentAuthToken;
    },

    storeAllAuthTokens(state, authtokens) {
      state.allAuthTokens = authtokens;
    },

    storeLastRefreshed(state, arg) {
      state.lastRefreshed = arg;
    },

    storeAlert(state, alert) {
      const key = crypto.randomBytes(5).toString("hex");
      state.alerts.push({ ...alert, key: key });
      setTimeout(() => {
        const index = state.alerts.findIndex((x) => x.key === key);
        if (index >= 0) {
          state.alerts.splice(index, 1);
        }
      }, 2000);
    },

    storeError(state, error) {
      state.meta.errorState.error = true;
      state.meta.errorState.status = error.status;
      state.meta.errorState.statusText = error.statusText;
    },

    resetError(state) {
      state.meta.errorState.error = false;
      state.meta.errorState.status = "";
      state.meta.errorState.statusText = "";
    },

    storeUpdateAvail(state, value) {
      state.meta.updateAvailable = value;
    },

    storeDashboardNetworksView(state, value) {
      state.meta.dashboardNetworksView = value;
    },
  },

  actions: {
    bootstrap(context) {
      context.commit("resetError");
      context.dispatch("getLastRefreshed");
      context.dispatch("getAllAuthTokens");
      context.dispatch("getFavorites");
      context.dispatch("getNetworks");
      context.dispatch("getDashboardNetworksView");
    },

    getNetworks(context) {
      context.commit("resetNetworks");
      ipcRenderer.once("bootstrap-resopnse", (event, arg) => {
        context.commit("storeNetworks", arg);
        const now = new Date();
        context.dispatch("setLastRefreshed", now.getTime());
        context.dispatch("getLastRefreshed");
      });
      ipcRenderer.once("bootstrap-response-error", (event, arg) => {
        context.commit("storeError", arg);
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

    reOrderFavorites(context, favorites) {
      ipcRenderer.sendSync("store-favorites", favorites);
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
      context.dispatch("getCurrentAuthToken", authtoken);
      context.dispatch("getAllAuthTokens");
    },

    addAuthToken(context, authtoken) {
      ipcRenderer.sendSync("add-authtoken", authtoken);
      context.dispatch("getCurrentAuthToken");
      context.dispatch("getAllAuthTokens");
    },

    removeAuthToken(context, authtoken) {
      ipcRenderer.sendSync("remove-authtoken", authtoken);
      context.dispatch("getCurrentAuthToken");
      context.dispatch("getAllAuthTokens");
    },

    getAllAuthTokens(context) {
      context.commit(
        "storeAllAuthTokens",
        ipcRenderer.sendSync("get-all-authtokens")
      );
    },

    getLastRefreshed(context) {
      context.commit(
        "storeLastRefreshed",
        ipcRenderer.sendSync("get-last-refreshed")
      );
    },

    setLastRefreshed(context, arg) {
      ipcRenderer.sendSync("set-last-refreshed", arg);
    },

    addAlert(context, alert) {
      context.commit("storeAlert", alert);
    },

    refresh(context) {
      context.dispatch("getNetworks");
    },

    getDashboardNetworksView(context) {
      context.commit(
        "storeDashboardNetworksView",
        ipcRenderer.sendSync("get-dashboard-networks-view")
      );
    },

    setDashboardNetworksView(context, arg) {
      ipcRenderer.sendSync("set-dashboard-networks-view", arg);
      context.dispatch("getDashboardNetworksView");
    },
  },
});
