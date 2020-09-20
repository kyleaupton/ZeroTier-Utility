<template>
  <v-card
    class="dashboard-network-card"
    outlined
    ripple
    @click="$router.push(`/network/${item.id}`)"
  >
    <div class="dashboard-network-card-container">
      <p class="dashboard-network-card-item dashboard-network-card-name">
        {{ item.config.name }}
      </p>
      <p class="dashboard-network-card-item dashboard-network-card-id">
        ID: {{ item.id }}
      </p>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Dashboard-Network",

  props: ["item"],
};
</script>

<style>
p {
  margin-bottom: 0px !important;
}
.dashboard-network-card {
  cursor: pointer;
  display: inline-block;
  padding: 12px;
}

.dashboard-network-card-container {
  display: flex;
  flex-direction: column;
}

.dashboard-network-card-item {
  text-align: left;
}

.dashboard-network-card-id {
  font-size: 12px;
  font-weight: 300;
}
</style>
