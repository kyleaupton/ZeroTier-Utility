module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        publish: ["github"],
        productName: "ZeroTier Utility",
        appId: "com.electron.zerotier-utility",
        mac: {
          category: "public.app-category.utilities",
          darkModeSupport: true,
          icon: "build/zerotier-utility-app-icon.icns",
        },
        win: {
          icon: "build/zerotier-utility-app-icon.ico",
        },
      },
    },
  },
  transpileDependencies: ["vuetify"],
};
