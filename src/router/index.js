import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Dashboard"),
  },
  {
    path: "/network",
    name: "Networks",
  },
  {
    path: "/network/:id",
    name: "Network",
    component: () => import("../views/Network"),
    meta: {
      showBack: true,
    },
  },
  {
    path: "/authtoken",
    name: "Authtoken",
    component: () => import("../views/NewAuthtoken"),
    meta: {
      showBack: true,
    },
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
