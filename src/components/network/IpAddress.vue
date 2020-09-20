<template>
  <div class="ip" @click="handleClick">{{ ip }}</div>
</template>

<script>
const { clipboard } = window.require("electron");

export default {
  name: "Ip",

  methods: {
    handleClick() {
      clipboard.writeText(this.ip);
      this.$store.dispatch("addAlert", "Copied to clipboard");
    },
  },

  props: ["ip"],
};
</script>

<style>
.ip {
  cursor: pointer;
}

.ip:active {
  font-weight: 100;
}
</style>
