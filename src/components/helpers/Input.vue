<template>
  <input
    class="input"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
    :placeholder="label || ''"
  />
</template>

<script>
export default {
  name: "Input",

  props: ["value", "label"],
};
</script>

<style>
.input {
  width: 100%;
  padding: 8px;

  color: var(--color-text-primary);
  background: transparent;
  caret-color: var(--color-caret-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  transition: var(--transition-primary);
}

.input:hover {
  border: 1px solid var(--color-border-primary-hover);
}

.input:focus {
  outline: var(--color-primary);
  border: 1px solid var(--color-primary);
}
</style>
