<template>
  <div class="dashboard-container">
    <div v-if="!error">
      <div v-if="loaded">
        <div class="dashboard-content-container">
          <DashboardNetworkSelector class="dashboard-title" />
          <div class="dashboard-content-section">
            <v-text-field
              class="dashboard-content-search"
              v-model="networkFilter"
              label="Search for a network"
              :hide-details="true"
              solo
              dense
            />
            <div class="dashboard-network-container">
              <DashboardNetwork
                v-for="network in networksFiltered"
                :key="network.id"
                class="dashboard-network"
                :item="network"
              />
            </div>
          </div>
          <div class="dashboard-title dashboard-title-bookmarks">Bookmarks</div>
          <div class="dashboard-content-section">
            <v-text-field
              class="dashboard-content-search"
              v-model="bookmarkFilter"
              label="Search for a peer"
              :hide-details="true"
              solo
              dense
            />
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
import DashboardNetworkSelector from "../components/dashboard/Dashboard-Network-Selector";
import Peer from "../components/network/Peer";
import Loading from "../components/helpers/Loading";
import Error from "./Error";

import draggable from "vuedraggable";

export default {
  name: "Dashboard",

  components: {
    DashboardNetwork,
    DashboardNetworkSelector,
    Peer,
    Loading,
    draggable,
    Error,
  },

  data() {
    return {
      networkFilter: "",
      bookmarkFilter: "",
    };
  },

  watch: {
    networkFilter() {
      console.log(this.filter);
    },
  },

  computed: {
    error() {
      return this.$store.state.meta.errorState.error;
    },

    networks() {
      const networkView = this.$store.state.meta.dashboardNetworksView;
      const allNetworks = this.$store.state.allNetworks.items;
      if (networkView === "all-networks") {
        return allNetworks;
      } else {
        let payload = [];
        allNetworks.forEach((network) => {
          if (network.isSubscribed === true) {
            payload.push(network);
          }
        });
        return payload;
      }
    },

    networksFiltered() {
      return this.networks.filter((network) => {
        const filter = this.networkFilter.toLowerCase();
        if (network.config.name.toLowerCase().includes(filter)) {
          return true;
        }
      });
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

          return payload.filter((item) => {
            const filter = this.bookmarkFilter.toLowerCase();
            if (
              item.name.toLowerCase().includes(filter) ||
              item.description.toLowerCase().includes(filter)
            )
              return true;
          });
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

  methods: {
    handletest() {
      console.log(this.networkFilter);
    },
  },
};
</script>

<style>
.dashboard-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-content-container {
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  text-align: left;
}

.dashboard-title-bookmarks {
  padding: 1px;
}

.dashboard-network-container {
  overflow: scroll;
  display: flex;
  flex-direction: column;
  max-height: 280px;
  margin-bottom: -14px;
}

.dashboard-content-section {
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  margin-bottom: 12px;
}

.dashboard-content-search {
  margin-bottom: 8px !important;
}

.dashboard-network {
  width: 100%;
  flex: 0 0 45%;
}

.dashboard-network:not(:last-child) {
  margin: 0 0 8px 0;
}

.dashboard-favorites-container {
  display: flex;
  flex-direction: column;
  max-height: 280px;
  overflow: scroll;
  margin-bottom: -14px;
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
