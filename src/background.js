"use strict";

import path from "path";

import { app, protocol, BrowserWindow, Tray } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import Positioner from "electron-positioner";

const isDevelopment = process.env.NODE_ENV !== "production";

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

    const positioner = new Positioner(win);

    win.setMinimumSize(550, 800);
    win.setSize(550, 800);
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

function createWindow() {
  // Create main window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hiddenInset",
    show: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
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
  const filePath = path.join(__dirname, "assets", "IconTemplate.png");
  tray = new Tray(filePath);
  tray.on("click", () => {
    showWindow();
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
