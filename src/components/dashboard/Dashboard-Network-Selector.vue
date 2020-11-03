<template>
  <div>
    <div class="dashboard-network-selector-title" @click="toggleView()">
      {{ currentTitle }}
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardNetworkSelector",

  data() {
    return {};
  },

  computed: {
    currentNetworkView() {
      return this.$store.state.meta.dashboardNetworksView;
    },

    currentTitle() {
      return this.currentNetworkView === "my-networks"
        ? "Subscribed Networks"
        : "All Networks";
    },
  },

  methods: {
    toggleView() {
      const target =
        this.currentNetworkView === "my-networks"
          ? "all-networks"
          : "my-networks";
      this.$store.dispatch("setDashboardNetworksView", target);
    },
  },
};
</script>

<style>
.dashboard-network-selector-title {
  cursor: pointer;
  display: inline-block;
  border: 1px solid transparent;
  transition: var(--transition-primary);
}

.dashboard-network-selector-title:hover {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-hover);
}

.dashboard-network-selector-title:active {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-active);
}
</style>
