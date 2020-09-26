import { app, ipcMain } from "electron";
import axios from "axios";
import os from "os";
import path from "path";
import sudo from "sudo-prompt";
import db from "../db/index";

let localAuthtoken;

export function API() {
  return new Promise((resolve) => {
    const url = "https://my.zerotier.com/api";
    async function sendRequest(param) {
      const response = await axios({
        method: param.method || "GET",
        url: `${url}${param.url}`,
        headers: {
          Authorization: `bearer ${param.authtoken}`,
        },
      });
      return response.data;
    }

    const localPort = "9993";
    async function sendRequestLocal(param) {
      const response = await axios({
        method: param.method || "GET",
        url: `http://localhost:${localPort}${param.url}`,
        headers: {
          "X-ZT1-Auth": `${localAuthtoken}`,
        },
      });
      return response.data;
    }

    ipcMain.on("bootstrap", async (event) => {
      try {
        // First get list of all the subscribed networks form the local json zt api.
        const subscribedNetworks = await sendRequestLocal({
          url: "/network",
          method: "GET",
        });

        // Then get current authtoken
        const authtoken = db
          .get("auth")
          .get("currentAuthToken")
          .value();

        // Get all the network for current authtoken
        const networks = await sendRequest({
          method: "GET",
          url: "/network",
          authtoken,
        });

        // Now that we have the networks, simply transverse them and map
        // subscribed networks with networks
        let payload = [];
        await Promise.all(
          networks.map(async (network) => {
            const find = subscribedNetworks.find((x) => x.id === network.id);
            if (find) {
              // Now lets find all of the peers on this network
              const response = await sendRequest({
                method: "GET",
                url: `/network/${network.id}/member`,
                authtoken,
              });
              payload.push({
                ...network,
                peers: response,
              });
            }
          })
        );

        event.reply("bootstrap-resopnse", payload);
      } catch (error) {
        event.reply("bootstrap-response-error", {
          status: error.response.status,
          statusText: error.response.statusText,
        });
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

    return resolve();
  });
}

export function getLocalAuthToken() {
  return new Promise((resolve) => {
    let workingDirectory;
    switch (os.platform()) {
      case "darwin":
        workingDirectory = path.join(
          "/Library",
          "Application\\ Support",
          "ZeroTier",
          "One"
        );
        break;

      case "win32":
        workingDirectory = path.join("\\ProgramData", "ZeroTier", "One");
        break;

      case "linux":
        workingDirectory = path.join("/var", "lib", "zerotier-one");
        break;

      case "freebsd":
      case "openbsd":
        workingDirectory = path.join("/var", "db", "zerotier-one");
    }

    const command =
      os.platform() === "win32"
        ? `type ${workingDirectory}\\authtoken.secret`
        : `cat ${workingDirectory}/authtoken.secret`;

    sudo.exec(
      command,
      {
        name: "ZeroTier Utility",
      },
      (error, stdout) => {
        if (error) {
          app.exit();
        }
        localAuthtoken = stdout;
        return resolve();
      }
    );
  });
}
