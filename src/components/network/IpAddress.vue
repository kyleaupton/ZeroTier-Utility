<template>
  <div>
    <div
      id="ip-address"
      class="ip"
      :class="{ notActualPeer: !isActualPeer }"
      @click="handleClick"
    >
      {{ ip }}
    </div>
  </div>
</template>

<script>
const { clipboard } = window.require("electron");
import tippy from "tippy.js";

export default {
  name: "Ip",

  mounted() {
    if (!this.isActualPeer) {
      tippy("#ip-address", {
        content: "You have no access to this peer.",
        theme: "custom",
      });
    }
  },

  methods: {
    handleClick() {
      clipboard.writeText(this.ip);
      this.$store.dispatch("addAlert", { text: "Copied to clipboard" });
    },
  },

  props: ["ip", "isActualPeer"],
};
</script>

<style>
.ip {
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition-primary);
}

.ip:hover {
  border: 1px solid var(--color-border);
  background: var(--color-background-hover);
}

.ip:active {
  border: 1px solid var(--color-border);
  background: var(--color-background-active);
}

.notActualPeer {
  background: var(--color-background-peer-notPeer);
}
</style>
