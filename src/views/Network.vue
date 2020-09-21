<template>
  <div>
    <div v-if="loaded" class="network-container">
      <div>{{ network.config.name }}</div>
      <div class="network-item">
        <v-text-field
          v-model="filter"
          label="Search for a peer"
          :hide-details="true"
          solo
          dense
        />
      </div>
      <div>
        <div v-for="peer in items" :key="peer.nodeId" class="network-item">
          <Peer :item="peer" />
        </div>
      </div>
    </div>
    <div v-else>Loading...</div>
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

  created() {
    console.log(this.$store.state.allNetworks.items);
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

  watch: {
    network() {
      console.log(this.network);
    },
  },
};
</script>

<style>
.network-container {
  display: flex;
  flex-direction: column;
  margin: 8px;
}

.network-item {
  margin: 8px 0 0 0;
}

.scroll-overflow-y {
  overflow-y: scroll;
}
</style>
