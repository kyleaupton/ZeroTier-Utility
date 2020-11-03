<template>
  <Card class="peer-container" :hover="true">
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
        <div v-if="!isOnline" class="peer-last-seen">{{ lastSeen }}</div>
      </div>
      <div class="peer-content-item">
        <div class="peer-content-item-container">
          <div class="peer-content-item">
            <div v-for="ip in item.config.ipAssignments" :key="ip">
              <IpAddress :ip="ip" :isActualPeer="item.isActualPeer" />
            </div>
          </div>
          <div>
            <v-btn icon small @click="handleClick">
              <v-icon>{{ icon }}</v-icon>
            </v-btn>
          </div>
          <v-icon v-if="item.networkData" class="peer-handle"
            >mdi-drag-vertical</v-icon
          >
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import moment from "moment";

import IpAddress from "./IpAddress";
import Card from "../helpers/Card";

export default {
  name: "Peer",

  components: {
    IpAddress,
    Card,
  },

  data() {
    return {
      lastSeen: "",
    };
  },

  created() {
    if (!this.isOnline) {
      this.getLastSeen();
      setInterval(() => {
        this.getLastSeen();
      }, 1000);
    }
  },

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
      return this.isFavorite ? "mdi-bookmark-check" : "mdi-bookmark-outline";
    },

    isFavorite() {
      return !!this.$store.state.favorites.find((x) => x === this.item.id);
    },

    isOnline() {
      return this.item.online;
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

    getLastSeen() {
      this.lastSeen = `Last seen ${moment(this.item.lastOnline).fromNow()}`;
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
  border-radius: 3px;
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

.peer-desc,
.peer-last-seen {
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

.peer-handle-container {
  position: absolute;
  right: 0;
}

.peer-handle {
  cursor: move;
}
</style>
