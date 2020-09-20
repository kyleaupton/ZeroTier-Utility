<template>
  <v-card class="peer-container" outlined>
    <div class="peer-status" :style="statusColor" />
    <div class="peer-content-container">
      <div class="peer-content-item">
        <div v-if="item.networkData" class="peer-network-container">
          <div class="peer-network-from">from</div>
          <div class="peer-network-name">
            {{ item.networkData.config.name }}
          </div>
        </div>
        <div class="peer-name">{{ name }}</div>
        <div class="peer-desc">{{ item.description }}</div>
      </div>
      <div class="peer-content-item">
        <div class="peer-content-item-container">
          <div class="peer-content-item">
            <div v-for="ip in item.config.ipAssignments" :key="ip">
              <IpAddress :ip="ip" />
            </div>
          </div>
          <div>
            <v-btn icon>
              <v-icon @click="handleClick">{{ icon }}</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import IpAddress from "./IpAddress";

export default {
  name: "Peer",

  components: {
    IpAddress,
  },

  created() {},

  computed: {
    statusColor() {
      return {
        "--color": this.item.online
          ? this.$vuetify.theme.themes.dark.success
          : this.$vuetify.theme.themes.dark.warning,
      };
    },

    name() {
      return this.item.name.length ? this.item.name : "No name";
    },

    icon() {
      return this.isFavorite ? "mdi-heart" : "mdi-heart-outline";
    },

    isFavorite() {
      return !!this.$store.state.favorites.find((x) => x === this.item.id);
    },
  },

  methods: {
    handleClick() {
      if (this.isFavorite) {
        // remove favorite
        this.$store.dispatch("removeFavorite", this.item.id);
      } else {
        // add favorite
        this.$store.dispatch("addFavorite", this.item.id);
      }
    },
  },

  props: ["item"],
};
</script>

<style>
.peer-container {
  padding: 8px;
  display: flex;
}

.peer-status {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 8px;
  background-color: var(--color);
}

.peer-content-container {
  display: flex;
  margin: 0 0 0 8px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.peer-content-item-container {
  display: flex;
  align-items: center;
}

.peer-name {
  font-size: 14px;
}

.peer-desc {
  font-size: 12px;
  font-weight: 300;
}

.peer-content-item {
  margin: 0 4px 0;
}

.peer-network-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.peer-network-from {
  font-size: 10px;
  font-weight: 300;
  margin: 0 4px 0 0;
}

.peer-network-name {
  font-size: 14px;
}
</style>
