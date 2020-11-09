<template>
  <div>
    <Input
      v-model="filter"
      class="bookmarks-search"
      label="Search for a bookmarked peer"
    />
    <div>
      <draggable
        v-model="favorites"
        tag="div"
        ghost-class="ghost"
        handle=".peer-handle"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group name="flip-list">
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
</template>

<script>
import Peer from "../../components/network/Peer";
import Input from "../helpers/Input";

import draggable from "vuedraggable";

export default {
  name: "DashboardBookmarks",

  components: {
    Peer,
    Input,
    draggable,
  },

  data() {
    return {
      filter: "",
      drag: false,
    };
  },

  computed: {
    allNetworks() {
      return this.$store.state.allNetworks.items;
    },

    favorites: {
      get() {
        if (this.allNetworks.length) {
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
            const filter = this.filter.toLowerCase();
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
};
</script>

<style>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.dashboard-content-search {
  margin-bottom: 8px !important;
}

.dashboard-favorites-item {
  margin: 0 0 8px 0;
}

.bookmarks-search {
  margin: 0 0 8px 0;
}

.flip-list-move {
  transition: transform 0.5s;
}

.flip-list-enter-active,
.flip-list-leave-active {
  transition: opacity 0.2s ease;
}

.flip-list-enter,
.flip-list-leave-to {
  opacity: 0;
}

.no-move {
  transition: transform 0s;
}
</style>
