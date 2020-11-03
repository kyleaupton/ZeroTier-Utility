<template>
  <div>
    <Input
      v-model="filter"
      class="networks-search"
      label="Search for a network"
    />
    <div class="networks-network-container">
      <DashboardNetwork
        class="networks-network"
        v-for="network in networksFiltered"
        :key="network.id"
        :item="network"
      />
    </div>
  </div>
</template>

<script>
import DashboardNetwork from "./Dashboard-Network";
import Input from "../helpers/Input";

export default {
  name: "DashboardNetworks",

  components: {
    DashboardNetwork,
    Input,
  },

  data() {
    return {
      filter: "",
    };
  },

  computed: {
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
        const filter = this.filter.toLowerCase();
        if (network.config.name.toLowerCase().includes(filter)) {
          return true;
        }
      });
    },
  },
};
</script>

<style>
.networks-search {
  margin: 0 0 8px 0 !important;
}

.networks-network-container {
  display: flex;
  flex-direction: column;
}

.networks-network:not(:last-child) {
  margin: 0 0 8px 0;
}
</style>
