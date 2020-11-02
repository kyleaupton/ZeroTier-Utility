<template>
  <div v-if="updateAvail" class="update-container" :style="containerStyle">
    <div class="update-item">
      <p>
        A new update is available!
        <span class="update-link" @click="handleClick()"
          >Click here to apply.</span
        >
      </p>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "Update",

  computed: {
    updateAvail() {
      return this.$store.state.meta.updateAvailable;
    },

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
  width: calc(100% + 16px);
  margin: -8px -8px 4px -8px;
  background-color: var(--background-color);
}

.update-item {
  margin: 4px;
}

.update-link {
  cursor: pointer;
  text-decoration: underline;
}
</style>
