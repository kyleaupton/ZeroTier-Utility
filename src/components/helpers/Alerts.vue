<template>
  <div class="alert-container">
    <div v-for="(alert, i) in alerts" :key="i">
      <v-alert class="alert" type="success" dense>{{ alert }}</v-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: "Alerts",

  computed: {
    alerts() {
      return this.$store.state.alerts;
    },
  },
};
</script>

<style>
.alert-container {
  position: fixed;
  pointer-events: none;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
</style>
