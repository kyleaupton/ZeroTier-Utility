<template>
  <div class="back-button-container-main">
    <v-divider />
    <div class="back-button-container">
      <v-btn v-if="show" class="back-button" outlined @click="$router.go(-1)"
        >back</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Back",

  computed: {
    show() {
      return this.$route.meta.showBack;
    },
  },
};
</script>

<style>
.back-button-container-main {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.back-button-container {
  display: inline-block;
  margin: 8px 0 8px 8px;
}
</style>
