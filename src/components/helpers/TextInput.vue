<template>
  <div>
    <v-text-field
      @input="handleInput"
      :label="label"
      :hide-details="true"
      solo
      dense
    />
    <v-btn @click="test">test2</v-btn>
  </div>
</template>

<script>
export default {
  name: "TextInput",

  methods: {
    handleInput() {
      console.log(this.value);
      this.$emit("input", this.value);
    },

    test() {
      console.log(this.value);
    },
  },

  //   props: ["value", "label"],
  props: {
    value: {
      type: String,
    },

    label: {
      type: String,
    },
  },
};
</script>

<style></style>
