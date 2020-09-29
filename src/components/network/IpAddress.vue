<template>
  <div class="ip" :style="ipStyling" @click="handleClick">{{ ip }}</div>
</template>

<script>
const { clipboard } = window.require("electron");

export default {
  name: "Ip",

  computed: {
    darkMode() {
      return this.$store.state.meta.darkMode;
    },

    ipStyling() {
      return {
        "--border-color": this.darkMode ? "white" : "black",
        "--background-color-hover": this.darkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
        "--background-color-active": this.darkMode
          ? "rgba(255, 255, 255, 0.5)"
          : "rgba(0, 0, 0, 0.5)",
      };
    },
  },

  methods: {
    handleClick() {
      clipboard.writeText(this.ip);
      this.$store.dispatch("addAlert", { text: "Copied to clipboard" });
    },
  },

  props: ["ip"],
};
</script>

<style>
.ip {
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

.ip:hover {
  border: 1px solid var(--border-color);
  background: var(--background-color-hover);
}

.ip:active {
  border: 1px solid var(--border-color);
  background: var(--background-color-active);
}
</style>
