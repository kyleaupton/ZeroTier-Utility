<template>
  <div class="error-container">
    <v-icon :color="iconColor" x-large>mdi-alert-circle</v-icon>
    <div>
      <p>Uh Oh! Looks like there's an error with ZeroTier's API:</p>
      <div>
        <div class="error-status">
          Status:
          <div class="error-status-meta">{{ status }}</div>
        </div>
      </div>
      <div>
        <div class="error-status">
          Status text:
          <div class="error-status-meta">{{ statusText }}</div>
        </div>
      </div>
    </div>
    <p v-if="errorTip.length" class="error-tip">{{ errorTip }}</p>
  </div>
</template>

<script>
export default {
  name: "Error",

  computed: {
    iconColor() {
      return this.$vuetify.theme.themes.light.warning;
    },

    status() {
      return this.$store.state.meta.errorState.status;
    },

    statusText() {
      return this.$store.state.meta.errorState.statusText;
    },

    errorTip() {
      switch (this.status) {
        case 403:
          return "Looks like your authtoken is wrong, please try a different one.";
        default:
          return "";
      }
    },
  },
};
</script>

<style>
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  word-break: normal;
}

.error-status {
  display: inline-block;
  margin: 0 0 0 36px;
}

.error-status-meta {
  display: inline-block;
  border: 1px solid red;
  border-radius: 4px;
  background: rgba(255, 0, 0, 0.2);
  padding: 2px;
}

.error-tip {
  text-align: center;
  margin: 36px 12px;
}
</style>
