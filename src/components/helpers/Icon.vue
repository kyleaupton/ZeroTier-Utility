<template>
  <div class="icon-container">
    <component :is="icon" />
  </div>
</template>

<script>
import modules from "../icons/index";

export default {
  name: "Icon",

  components: {
    ...modules,
  },

  props: ["icon"],
};
</script>

<style>
.icon-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
