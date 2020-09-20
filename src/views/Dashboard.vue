<template>
  <div class="dashboard-container">
    <div class="dashboard-title">My networks</div>
    <div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",

  created() {
    console.log(this.$store.state.allNetworks);
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
</style>
