<template>
  <div class="card-container" :class="styles" @click="$emit('click')">
    <slot />
  </div>
</template>

<script>
export default {
  name: "Card",

  computed: {
    styles() {
      return {
        "card-container-hover": this.hover,
        "card-container-active": this.active,
      };
    },
  },

  props: ["hover", "active"],
};
</script>

<style>
.card-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  /* background: var(--color-secondary); */
  transition: var(--transition-primary);
}

.card-container-hover:hover {
  border: 1px solid var(--color-border-primary-hover);
  border-radius: 4px;
}

.card-container-active:active {
  border: 1px solid var(--color-border-primary-active);
  border-radius: 4px;
}
</style>
