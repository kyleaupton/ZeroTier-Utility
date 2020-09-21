<template>
  <div>
    <v-app-bar dense>
      <v-menu>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense outlined subheader>
          <v-subheader>Authtokens</v-subheader>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :disabled="item.current"
            @click="handleChangeItem(item)"
          >
            <v-list-item-action @click="test">
              <v-icon>mdi-check-circle</v-icon>
            </v-list-item-action>
            <v-list-item-content>{{ item.nickname }}</v-list-item-content>
            <v-list-item-icon v-if="item.current">
              <v-icon>mdi-check-circle</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-divider />

          <v-list-item dense outlined @click="handleNewItem">
            <v-list-item-content>Add New</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "Header",

  created() {
    this.$store.dispatch("getAllAuthTokens");
  },

  computed: {
    items() {
      let payload = [];
      const authtokens = this.$store.state.allAuthTokens;
      const current = this.$store.state.currentAuthToken;
      authtokens.forEach((token) => {
        payload.push({
          ...token,
          current: current === token.authtoken,
        });
      });
      return payload;
    },
  },

  methods: {
    handleNewItem() {
      this.$router.push("/authtoken");
    },

    handleChangeItem(item) {
      console.log(item.authtoken);
      this.$store.dispatch("setCurrentAuthToken", item.authtoken);
    },

    test() {
      console.log("test");
    },
  },
};
</script>

<style></style>
