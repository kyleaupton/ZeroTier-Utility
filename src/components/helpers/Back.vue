<template>
  <div v-if="show" class="back-button-container-main" :style="style">
    <v-divider />
    <div class="back-button-container">
      <v-btn class="back-button" outlined @click="$router.go(-1)">back</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "Back",

  created() {},

  computed: {
    show() {
      return this.$route.meta.showBack;
    },

    color() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark.warning;
      } else {
        return this.$vuetify.theme.themes.light.warning;
      }
    },

    style() {
      return {
        "--background-color": this.color,
      };
    },
  },
};
</script>

<style>
.back-button-container-main {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

.back-button-container {
  display: inline-block;
  margin: 8px 0 8px 8px;
}
</style>
