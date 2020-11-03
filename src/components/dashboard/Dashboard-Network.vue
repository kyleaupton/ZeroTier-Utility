<template>
  <Card
    class="dashboard-network-card"
    :hover="true"
    :active="true"
    @click="handleClick"
  >
    <div class="dashboard-network-card-container">
      <p class="dashboard-network-card-item dashboard-network-card-name">
        {{ item.config.name }}
      </p>
      <p class="dashboard-network-card-item dashboard-network-card-id">
        ID: {{ item.id }}
      </p>
    </div>
  </Card>
</template>

<script>
import Card from "../helpers/Card";

export default {
  name: "Dashboard-Network",

  components: {
    Card,
  },

  methods: {
    handleClick() {
      this.$router.push(`/network/${this.item.id}`);
    },
  },

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

.dashboard-network-card-name {
  font-size: 16px;
  font-size: 3.5vw;
}

.dashboard-network-card-id {
  font-size: 12px;
  font-weight: 300;
}
</style>
