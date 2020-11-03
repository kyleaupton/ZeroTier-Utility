<template>
  <v-alert class="alert" :type="item.type || 'success'" dense>{{
    item.text
  }}</v-alert>
</template>

<script>
// This doesnt really need to be in it's own component, but fuck it.
export default {
  name: "Alert",

  props: ["item"],
};
</script>

<style>
.alert {
  position: relative;
  width: 100%;
}
</style>
