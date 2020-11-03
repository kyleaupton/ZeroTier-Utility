<template>
  <div class="alert-container">
    <transition-group name="fade">
      <div v-for="alert in alerts" :key="alert.key">
        <Alert :item="alert" />
      </div>
    </transition-group>
  </div>
</template>

<script>
import Alert from "./Alert";

export default {
  name: "Alerts",

  components: {
    Alert,
  },

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
