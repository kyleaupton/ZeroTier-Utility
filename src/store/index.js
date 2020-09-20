import Vue from "vue";
import Vuex from "vuex";
const { ipcRenderer } = window.require("electron");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentAuthToken: "",
    networks: null,
  },

  mutations: {
    storeNetworks(state, networks) {
      state.networks = networks;
    },
  },

  actions: {
    getNetworks(context) {
      ipcRenderer.on("bootstrap-resopnse", (event, arg) => {
        context.commit("storeNetworks", arg);
      });
      ipcRenderer.send("bootstrap");
    },
  },
});
