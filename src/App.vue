<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "App",

  components: {},

  created() {
    ipcRenderer.on("bootstrap-resopnse", (event, arg) => {
      console.log(arg);
    });
    ipcRenderer.send("bootstrap");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
