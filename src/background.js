"use strict";
/* global __static */

import path from "path";

import {
  app,
  protocol,
  BrowserWindow,
  Tray,
  ipcMain,
  nativeTheme,
  screen,
  // eslint-disable-next-line no-unused-vars
  Notification,
  Menu,
} from "electron";
import { autoUpdater } from "electron-updater";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import Positioner from "electron-positioner";
import { API } from "./api/zt";

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";
app.setAppUserModelId("com.electron.zerotier-utility");
app.setAsDefaultProtocolClient("zerotier-utility");

const isDevelopment = process.env.NODE_ENV !== "production";

////////////////////////
const size = {
  x: 500,
  y: 805,
};
////////////////////////

// Hide dock on mac
if (process.platform === "darwin") {
  app.dock.hide();
}

app.setName("ZeroTier Utility");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;
let tray = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function showWindow() {
  if (!win) {
    createWindow();
  }

  if (tray) {
    const trayBounds = tray.getBounds();
    let position = "trayCenter";

    if (process.platform === "win32") {
      const trayScreen = screen.getDisplayNearestPoint({
        x: trayBounds.x,
        y: trayBounds.y,
      });

      const workArea = trayScreen.workArea;
      const screenBounds = trayScreen.bounds;

      if (workArea.x > 0) {
        // TASKBAR LEFT
        position = "bottomLeft";
      } else if (workArea.y > 0) {
        // TASKBAR TOP
        position = "topRight";
      } else if (workArea.width < screenBounds.width) {
        // TASKBAR RIGHT
        position = "bottomRight";
      } else {
        // TASKBAR BOTTOM
        position = "bottomRight";
      }
    }

    const positioner = new Positioner(win);

    win.setMinimumSize(size.x, size.y);
    win.setSize(size.x, size.y);
    win.setResizable(false);
    win.setMovable(false);
    positioner.move(position, trayBounds);
  }

  win.show();
  win.focus();
}

function hideWindow() {
  win.hide();
}

function toggleWindow() {
  win.isVisible() ? hideWindow() : showWindow();
}

function createWindow() {
  // Create main window
  win = new BrowserWindow({
    width: size.x,
    height: size.y,
    show: false,
    fullscreenable: false,
    frame: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify();
  }

  win.on("closed", () => {
    win = null;
  });

  win.on("blur", () => {
    if (!process.env.WEBPACK_DEV_SERVER_URL) {
      hideWindow();
    }
  });
}

function createTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }

  const iconName = nativeTheme.shouldUseDarkColors
    ? "zerotier-utility-icon-white@2x.png"
    : "zerotier-utility-icon-dark@2x.png";
  const filePath = path.join(__static, iconName);
  tray = new Tray(filePath);
  tray.setToolTip("ZeroTier Utility");

  /**
   *  EVENTS
   */
  tray.on("click", () => {
    toggleWindow();
  });

  tray.on("right-click", () => {
    const contextMenu = Menu.buildFromTemplate([
      { role: "about" },
      {
        label: "Check for updates",
        click: () => {
          checkForUpdates();
        },
      },
      { type: "separator" },
      { role: "quit" },
    ]);
    tray.popUpContextMenu(contextMenu);
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
    showWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  API();
  createTray();
  createWindow();
  showWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("get-user-data-path", (event) => {
  event.returnValue = app.getPath("userData");
});

/**
 *  DARK MODE
 */
function updateDarkMode() {
  if (win) {
    win.send("dark-mode", nativeTheme.shouldUseDarkColors);
  }
}

nativeTheme.on("updated", () => {
  createTray();
  updateDarkMode();
});

ipcMain.on("get-dark-mode", () => {
  updateDarkMode();
});
///////////////////////////////////////////////////////////

/**
 *  UPDATE
 */
autoUpdater.on("update-downloaded", () => {
  win.send("update-available", true);
});

ipcMain.on("apply-update", () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on("update-available", () => {
  win.send("update-is-available");
});

autoUpdater.on("update-not-available", () => {
  win.send("update-not-available");
});

function checkForUpdates() {
  win.send("update-checking");
  autoUpdater.checkForUpdates();
}

setInterval(() => {
  autoUpdater.checkForUpdates();
}, 1000 * 60 * 60 * 12); // Check for an update every 12 hours
///////////////////////////////////////////////////////////
