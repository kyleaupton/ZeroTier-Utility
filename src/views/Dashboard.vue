<template>
  <div class="dashboard-container">
    <div v-if="!error">
      <div v-if="loaded">
        <div class="dashboard-content-container">
          <div class="dashboard-title">My networks</div>
          <div class="dashboard-network-container">
            <div v-for="network in networks" :key="network.id">
              <DashboardNetwork class="dashboard-network" :item="network" />
            </div>
          </div>
          <div class="dashboard-title">Favorites</div>
          <div class="dashboard-favorites-container">
            <draggable
              v-model="favorites"
              tag="div"
              ghost-class="ghost"
              handle=".peer-handle"
            >
              <transition-group>
                <div
                  class="dashboard-favorites-item"
                  v-for="fav in favorites"
                  :key="fav.id"
                >
                  <Peer :item="fav" />
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>
      <div v-else>
        <Loading />
      </div>
    </div>
    <div v-else class="dashboard-error">
      <Error />
    </div>
  </div>
</template>

<script>
import DashboardNetwork from "../components/dashboard/Dashboard-Network";
import Peer from "../components/network/Peer";
import Loading from "../components/helpers/Loading";
import Error from "./Error";

import draggable from "vuedraggable";

export default {
  name: "Dashboard",

  components: {
    DashboardNetwork,
    Peer,
    Loading,
    draggable,
    Error,
  },

  created() {},

  computed: {
    error() {
      return this.$store.state.meta.errorState.error;
    },

    networks() {
      return this.$store.state.allNetworks.items;
    },

    loaded() {
      return this.$store.state.allNetworks.loaded;
    },

    favorites: {
      get() {
        if (this.loaded) {
          let payload = [];
          const baseFavs = this.$store.state.favorites;
          const networks = this.$store.state.allNetworks.items;

          baseFavs.forEach((fav) => {
            let items = fav.split("-");
            const foundNetwork = networks.find((x) => x.id === items[0]);
            if (foundNetwork) {
              const foundPeer = foundNetwork.peers.find((y) => y.id === fav);
              if (foundPeer) {
                payload.push({
                  networkData: foundNetwork,
                  ...foundPeer,
                });
              }
            }
          });
          return payload;
        } else {
          return [];
        }
      },
      set(list) {
        let payload = [];
        list.forEach((peer) => {
          payload.push(peer.id);
        });
        this.$store.dispatch("reOrderFavorites", payload);
      },
    },
  },
};
</script>

<style>
.dashboard-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-content-container {
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  text-align: left;
  margin: 8px 0 8px 8px;
}

.dashboard-network-container {
  overflow-y: scroll;
}

.dashboard-favorites-container {
  display: flex;
  flex-direction: column;
  margin: 0 8px 0 8px;
}

.dashboard-network {
  margin: 0 0 0 8px;
  float: left;
}

.dashboard-favorites-item {
  margin: 0 0 8px 0;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.dashboard-error {
  width: 100%;
  height: 100%;
}
</style>
