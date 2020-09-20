<template>
  <v-card class="dashboard-favorite-container" outlined>
    <div class="dashboard-favorite-status" :style="statusColor" />
    <div class="dashboard-favorite-content-container">
      <div class="dashboard-favorite-content-item">
        <div class="dashboard-favorite-content-item-network">
          <div class="dashboard-favorite-content-item-network-meta">from</div>
          <div>{{ item.networkData.config.name }}</div>
        </div>
        <div class="dashboard-favorite-content-item-name">{{ name }}</div>
        <div class="dashboard-favorite-content-item-desc">
          {{ item.description }}
        </div>
      </div>
      <div class="dashboard-favorite-content-item">
        <div>test</div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "DashboardFavorite",

  computed: {
    statusColor() {
      return {
        "--color": this.item.online
          ? this.$vuetify.theme.themes.dark.success
          : this.$vuetify.theme.themes.dark.warning,
      };
    },

    name() {
      return this.item.name.length ? this.item.name : "No name";
    },
  },

  props: ["item"],
};
</script>

<style>
.dashboard-favorite-status {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 8px;
  background-color: var(--color);
}

.dashboard-favorite-container {
  display: flex;
  padding: 8px;
}

.dashboard-favorite-content-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 0 8px;
}

.dashboard-favorite-content-item-network {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  font-size: 14px;
}

.dashboard-favorite-content-item-network-meta {
  font-size: 10px;
  margin: 0 4px 0 0;
}

.dashboard-favorite-content-item-desc {
  font-size: 12px;
  font-weight: 300;
}
</style>
