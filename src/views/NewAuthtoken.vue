<template>
  <div class="authtoken-container">
    <div class="authtoken-item">Add ZeroTier API Authtoken</div>
    <div class="authtoken-item authtoken-search-container">
      <v-text-field
        class="authtoken-search"
        v-model="authtoken"
        label="Authtoken"
        :hide-details="true"
        solo
        dense
      />
    </div>
    <div class="authtoken-item authtoken-search-container">
      <v-text-field
        class="authtoken-search"
        v-model="nickname"
        label="Authtoken's nickname"
        :hide-details="true"
        solo
        dense
      />
    </div>
    <div class="authtoken-action-container">
      <v-btn class="authtoken-action-btn" outlined @click="handleClick"
        >Add</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "NewAuthtoken",

  data() {
    return {
      authtoken: "",
      nickname: "",
    };
  },

  methods: {
    handleClick() {
      this.$store.dispatch("addAuthToken", {
        authtoken: this.authtoken,
        nickname: this.nickname,
      });
      this.$store.dispatch("bootstrap");
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style>
.authtoken-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50%;
  width: 100%;
}

.authtoken-item {
  margin: 0 0 8px 0;
}

.authtoken-search-container {
  width: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.authtoken-action-container {
  width: 85%;
}

.authtoken-action-btn {
  float: right;
}
</style>
