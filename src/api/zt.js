import { ipcMain } from "electron";

import axios from "axios";

import util from "util";
const exec = util.promisify(require("child_process").exec);

import db from "../db/index";

async function sendRequest(param) {
  const url = "https://my.zerotier.com/api";
  const authtoken = db
    .get("auth")
    .get("currentAuthToken")
    .value();
  const response = await axios({
    method: param.method || "GET",
    url: `${url}${param.url}`,
    headers: {
      Authorization: `bearer ${authtoken}`,
    },
  });
  return response.data;
}

async function Bootstrap() {
  // 1) Get client id of local zt instance, this also checks if zt is installed
  // 2) Set that client id in the database
  // 3) Get all networks and clients in the networks
  // 4) Determine which networks the current client is apart of
  // 5) $$ profit $$

  const { stdout } = await exec("zerotier-cli status");
  // const stdout = null;

  if (!stdout) {
    throw Error("ZeroTier One is not installed.");
  }

  // TODO: Handle if zt is not installed

  const regex = /\s.{10}\s/g;
  const nodeIdObject = regex.exec(stdout);
  const nodeId = nodeIdObject[0].trim();

  const allNetworks = await sendRequest({
    method: "GET",
    url: "/network",
  });

  let payload = [];

  await Promise.all(
    allNetworks.map(async (network) => {
      const peers = await sendRequest({
        url: `/network/${network.id}/member`,
        method: "GET",
      });
      let isSubscribed = false;
      peers.forEach((peer) => {
        if (peer.nodeId === nodeId) {
          isSubscribed = true;
        }
      });
      peers.forEach((peer) => {
        peer.isActualPeer = isSubscribed;
      });
      payload.push({
        ...network,
        peers,
        isSubscribed,
      });
    })
  );

  // Alphabetize payload
  payload.sort((a, b) => {
    const aName = a.config.name.toLowerCase();
    const bName = b.config.name.toLowerCase();
    if (aName < bName) return -1;
    if (aName > bName) return 1;
    else return 0;
  });
  return payload;
}

export function API() {
  return new Promise((resolve) => {
    ipcMain.on("bootstrap", async (event) => {
      try {
        const payload = await Bootstrap();
        event.reply("bootstrap-resopnse", payload);
      } catch (error) {
        let payload;
        if (error.response) {
          payload = {
            status: error.response.status,
            statusText: error.response.statusText,
          };
        } else {
          payload = {
            statusText: error.message,
          };
        }
        event.reply("bootstrap-response-error", payload);
      }
    });

    ipcMain.on("add-authtoken", (event, arg) => {
      try {
        db.get("auth")
          .get("authTokens")
          .push(arg)
          .write();

        db.get("auth")
          .set("currentAuthToken", arg.authtoken)
          .write();
        event.returnValue = "Ok";
      } catch (error) {
        event.returnValue = error;
      }
    });

    ipcMain.on("remove-authtoken", (event, arg) => {
      try {
        db.get("auth")
          .get("authTokens")
          .remove({ authtoken: arg })
          .write();

        const current = db
          .get("auth")
          .get("currentAuthToken")
          .value();

        if (current === arg) {
          const temp = db
            .get("auth")
            .get("authTokens[0].authtoken")
            .value();

          if (temp) {
            db.get("auth")
              .set("currentAuthToken", temp)
              .write();
          } else {
            db.get("auth")
              .set("currentAuthToken", "")
              .write();
          }
        }

        event.returnValue = "Ok";
      } catch (error) {
        event.returnvalue = error;
      }
    });

    ipcMain.on("get-current-authtoken", (event) => {
      try {
        event.returnValue = db
          .get("auth")
          .get("currentAuthToken")
          .value();
      } catch (error) {
        event.returnValue = error;
      }
    });

    ipcMain.on("set-current-authtoken", (event, arg) => {
      try {
        db.set("auth.currentAuthToken", arg).write();
        event.returnValue = "Ok";
      } catch (error) {
        event.returnvalue = error;
      }
    });

    ipcMain.on("get-all-authtokens", (event) => {
      try {
        event.returnValue = db
          .get("auth")
          .get("authTokens")
          .value();
      } catch (error) {
        event.returnValue = error;
      }
    });

    ipcMain.on("get-last-refreshed", (event) => {
      try {
        event.returnValue = db
          .get("auth")
          .get("lastRefreshed")
          .value();
      } catch (error) {
        event.returnValue = event;
      }
    });

    ipcMain.on("set-last-refreshed", (event, arg) => {
      try {
        db.set("auth.lastRefreshed", arg).write();
        event.returnValue = "Ok";
      } catch (error) {
        event.returnValue = event;
      }
    });

    ipcMain.on("get-favorites", (event) => {
      try {
        event.returnValue = db.get("favorites").value();
      } catch (error) {
        event.returnvalue = error;
      }
    });

    ipcMain.on("add-favorite", (event, arg) => {
      try {
        db.get("favorites")
          .push(arg)
          .write();
        event.returnValue = "Ok";
      } catch (error) {
        event.returnValue = error;
      }
    });

    ipcMain.on("remove-favorite", (event, arg) => {
      try {
        db.get("favorites")
          .pull(arg)
          .write();
        event.returnValue = "Ok";
      } catch (error) {
        event.returnValue = error;
      }
    });

    ipcMain.on("store-favorites", (event, arg) => {
      try {
        db.set("favorites", arg).write();
        event.returnValue = "Ok";
      } catch (error) {
        event.returnValue = error;
      }
    });

    ipcMain.on("get-dashboard-networks-view", (event) => {
      try {
        event.returnValue = db.get("dashboardNetworksView").value();
      } catch (error) {
        event.returnValue = error;
      }
    });

    ipcMain.on("set-dashboard-networks-view", (event, arg) => {
      try {
        db.set("dashboardNetworksView", arg).write();
        event.returnValue = "Ok";
      } catch (error) {
        event.returnValue = error;
      }
    });

    return resolve();
  });
}
