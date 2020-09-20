<template>
  <div class="dashboard-container">
    <div v-if="loaded">
      <div class="dashboard-title">My networks</div>
      <div class="dashboard-network-container">
        <div v-for="network in networks" :key="network.id">
          <Network class="dashboard-network" :item="network" />
        </div>
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import Network from "../components/dashboard/Network";

export default {
  name: "Dashboard",

  components: {
    Network,
  },

  created() {
    // console.log(this.$store.state.allNetworks);
  },

  computed: {
    networks() {
      return this.$store.state.allNetworks.items;
    },

    loaded() {
      return this.$store.state.allNetworks.loaded;
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

.dashboard-title {
  text-align: left;
  margin: 8px 0 8px 8px;
}

.dashboard-network-container {
  overflow-y: scroll;
}

.dashboard-network {
  margin: 0 0 0 8px;
  float: left;
}
</style>
