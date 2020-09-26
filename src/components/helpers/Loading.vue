<template>
  <div class="loading-container">
    <v-progress-circular indeterminate color="warining" />
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<style>
.loading-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
