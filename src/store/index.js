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
  },

  mutations: {
    storeDarkMode(state, darkMode) {
      state.meta.darkMode = darkMode;
    },

    storeNetworks(state, networks) {
      state.allNetworks.items = networks;
      state.allNetworks.loaded = true;
    },

    storeCurrentAuthToken(state, currentAuthToken) {
      this.state.currentAuthToken = currentAuthToken;
    },
  },

  actions: {
    getNetworks(context) {
      ipcRenderer.on("bootstrap-resopnse", (event, arg) => {
        context.commit("storeNetworks", arg);
      });
      ipcRenderer.send("bootstrap");
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
  },
});
