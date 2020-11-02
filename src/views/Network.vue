<template>
  <div class="network-container">
    <div>{{ network.config.name }}</div>
    <div class="network-item">
      <v-text-field
        v-model="filter"
        label="Search for a peer"
        :hide-details="true"
        outlined
        single-line
        dense
      />
    </div>
    <div>
      <div v-for="peer in items" :key="peer.nodeId" class="network-item">
        <Peer :item="peer" />
      </div>
    </div>
  </div>
</template>

<script>
import Peer from "../components/network/Peer";

export default {
  name: "Network",

  components: {
    Peer,
  },

  data() {
    return {
      filter: "",
    };
  },

  computed: {
    network() {
      if (this.loaded) {
        return this.$store.state.allNetworks.items.find(
          (x) => x.id === this.$route.params.id
        );
      } else {
        return null;
      }
    },

    loaded() {
      return this.$store.state.allNetworks.loaded;
    },

    items() {
      return this.network.peers.filter((peer) => {
        const filter = this.filter.toLowerCase();
        if (
          peer.name.toLowerCase().includes(filter) ||
          peer.description.toLowerCase().includes(filter)
        )
          return true;
      });
    },
  },
};
</script>

<style>
.network-container {
  display: flex;
  flex-direction: column;
}

.network-item {
  margin: 8px 0 0 0;
}

.scroll-overflow-y {
  overflow-y: scroll;
}
</style>
