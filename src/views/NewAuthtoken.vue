<template>
  <div class="authtoken-container">
    <div class="authtoken-item">Add ZeroTier API Authtoken</div>
    <div class="authtoken-item authtoken-search-container">
      <Input v-model="authtoken" label="Authtoken" />
    </div>
    <div class="authtoken-item authtoken-search-container">
      <Input v-model="nickname" label="Authtoken's nickname" />
    </div>
    <div class="authtoken-action-container">
      <v-btn class="authtoken-action-btn" outlined @click="handleClick"
        >Add</v-btn
      >
    </div>
  </div>
</template>

<script>
import Input from "../components/helpers/Input";

export default {
  name: "NewAuthtoken",

  components: {
    Input,
  },

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
