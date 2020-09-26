<template>
  <v-app-bar dense :app="true">
    <v-menu>
      <template v-slot:activator="{ attrs, on }">
        <v-btn icon small v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense outlined subheader>
        <v-subheader>Authtokens</v-subheader>
        <v-list-item v-for="(item, i) in items" :key="i">
          <div class="header-list-item-container">
            <div class="header-list-item-current header-list-item">
              <v-icon
                class="header-list-item-current-icon"
                small
                :class="{
                  'header-list-item-current-icon-inactive': !item.current,
                }"
              >
                mdi-check-circle
              </v-icon>
            </div>
            <div
              class="header-list-item-nickname header-list-item"
              :class="{
                'header-list-item-nickname-active': !item.current,
                'header-list-item-nickname-inactive': item.current,
              }"
              :style="nickNameStyleing"
              @click="handleChangeItem(item)"
            >
              {{ item.nickname }}
            </div>
            <div class="header-list-item-delete header-list-item">
              <v-icon
                small
                class="header-list-item-delete-icon"
                @click.native="handleRemoveItem(item)"
                >mdi-close-circle</v-icon
              >
            </div>
          </div>
        </v-list-item>

        <v-divider />

        <v-list-item dense outlined @click="handleNewItem">
          <v-list-item-content>Add New</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <div v-if="back" @click="handleBack()">
      <v-btn icon small>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>

    <v-spacer />

    <p class="header-last-refreshed">{{ lastRefreshed }}</p>
    <v-btn icon small @click="handleRefresh()">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import moment from "moment";

export default {
  name: "Header",

  data() {
    return {
      lastRefreshed: "",
    };
  },

  mounted() {
    this.setLastRefreshed();
    setInterval(() => {
      this.setLastRefreshed();
    }, 1000);
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

    back() {
      return this.$route.meta.showBack;
    },

    darkMode() {
      return this.$store.state.meta.darkMode;
    },

    nickNameStyleing() {
      return {
        "--border-color": this.darkMode ? "white" : "black",
        "--background-color-hover": this.darkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
        "--background-color-active": this.darkMode
          ? "rgba(255, 255, 255, 0.5)"
          : "rgba(0, 0, 0, 0.5)",
      };
    },
  },

  methods: {
    handleNewItem() {
      this.$router.push("/authtoken");
    },

    handleChangeItem(item) {
      this.$store.dispatch("setCurrentAuthToken", item.authtoken);
    },

    handleRemoveItem(item) {
      this.$store.dispatch("removeAuthToken", item.authtoken);
    },

    handleRefresh() {
      this.$store.dispatch("refresh");
    },

    handleBack() {
      this.$router.go(-1);
    },

    setLastRefreshed() {
      this.lastRefreshed = `Last refreshed: ${moment(
        this.$store.state.lastRefreshed
      ).fromNow()}`;
    },
  },
};
</script>

<style>
.header-list-item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0px 0px 0px 0px !important;
}

.header-list-item {
  margin: 0 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-list-item-current-icon-inactive {
  visibility: hidden;
}

.header-list-item-nickname {
  min-width: 75px;
}

.header-list-item-nickname-inactive {
  cursor: no-drop;
}

.header-list-item-nickname-active {
  cursor: pointer;
}

.header-list-item-nickname-active:hover {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background-color-hover);
}

.header-list-item-nickname-active:active {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background-color-active);
}

.header-list-item-delete-icon {
  cursor: pointer;
}

.header-last-refreshed {
  font-size: 10px;
  font-weight: 300;
}
</style>
