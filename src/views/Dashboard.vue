<template>
  <div v-if="!error" class="dashboard-container">
    <div class="dashboard-content-container">
      <Update class="dashboard-upate" />
      <DashboardNetworkSelector class="dashboard-title" />
      <DashboardNetworks class="dashboard-networks" />
      <div class="dashboard-title dashboard-title-bookmarks">Bookmarks</div>
      <DashboardBookmarks class="dashboard-bookmarks" />
    </div>
  </div>
  <div v-else class="dashboard-error">
    <Error />
  </div>
</template>

<script>
import DashboardNetworks from "../components/dashboard/Dashboard-Networks";
import DashboardBookmarks from "../components/dashboard/Dashboard-Bookmarks";
import DashboardNetworkSelector from "../components/dashboard/Dashboard-Network-Selector";
import Error from "./Error";
import Update from "../components/helpers/Update";

export default {
  name: "Dashboard",

  components: {
    DashboardNetworks,
    DashboardBookmarks,
    DashboardNetworkSelector,
    Error,
    Update,
  },

  computed: {
    error() {
      return this.$store.state.meta.errorState.error;
    },

    loaded() {
      return this.$store.state.allNetworks.loaded;
    },
  },
};
</script>

<style>
.dashboard-container {
  /* height: 740px;
  width: 480px; */
  height: 92vh;
  width: 96.75vw; /* Eh, it works I guess. Not ideal tho */
}

.dashboard-content-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-networks {
  overflow: scroll;
}

.dashboard-bookmarks {
  overflow: scroll;
  flex: 1 0 55%;
}

.dashboard-title {
  text-align: left;
}

.dashboard-title-bookmarks {
  padding: 1px;
}

.dashboard-error {
  width: 100%;
  height: 100%;
}

.dashboard-upate {
}
</style>
