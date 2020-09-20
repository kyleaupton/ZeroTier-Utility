<template>
  <div>
    <div v-if="loaded" class="network-container">
      <div>{{ network.config.name }}</div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
export default {
  name: "Network",

  created() {},

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
  },
};
</script>

<style>
.network-container {
  display: flex;
  flex-direction: column;
  margin: 8px;
}
</style>
