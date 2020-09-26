<template>
  <div class="update-container" :style="containerStyle">
    <div class="update-item">
      <v-btn x-small @click="handleClick()">Apply Update</v-btn>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "Update",

  computed: {
    containerStyle() {
      return { "--background-color": this.$vuetify.theme.themes.light.warning };
    },

    textStyle() {
      return { "--border-color": this.darkMode ? "white" : "black" };
    },

    darkMode() {
      return this.$store.state.meta.darkMode;
    },
  },

  methods: {
    handleClick() {
      ipcRenderer.send("apply-update");
    },
  },
};
</script>

<style>
.update-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 28px;
  background-color: var(--background-color);
}

.update-item {
  margin: 0 8px;
}

.update-text {
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
</style>
