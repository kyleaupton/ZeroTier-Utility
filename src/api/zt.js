import { ipcMain } from "electron";
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
      try {
        const response = await axios({
          method: param.method || "GET",
          url: `${url}${param.url}`,
          headers: {
            Authorization: `bearer ${param.authtoken}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    }

    const localPort = "9993";
    async function sendRequestLocal(param) {
      try {
        const response = await axios({
          method: param.method || "GET",
          url: `http://localhost:${localPort}${param.url}`,
          headers: {
            "X-ZT1-Auth": `${localAuthtoken}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
    }

    ipcMain.on("bootstrap", async (event) => {
      try {
        // First get list of all the subscribed networks form the local json zt api.
        const subscribedNetworks = await sendRequestLocal({
          url: "/network",
          method: "GET",
        });

        // Then get lists of all networks from all zt authtokens.
        const authtokens = db
          .get("auth")
          .get("authTokens")
          .value();

        const networks = await Promise.all(
          authtokens.map(async (x) => {
            return await sendRequest({
              method: "GET",
              url: "/network",
              authtoken: x.authtoken,
            });
          })
        );

        // We currently have a list of:
        // 1) Networks this client is subscribed to
        // 2) A list of networks from every api token
        // We now need to map the two together, and return
        // something that looks like the following...
        // TODO: write "the following".

        let payload = [];

        for (let i = 0; i < authtokens.length; i++) {
          let temp = {
            ...authtokens[i],
            networks: [],
          };

          for (let k = 0; k < networks[i].length; k++) {
            const found = subscribedNetworks.find(
              (element) => element.nwid === networks[i][k].id
            );
            if (found) {
              temp.networks.push(networks[i][k]);
            }
          }
          payload.push(temp);
        }

        event.reply("bootstrap-resopnse", payload);
      } catch (error) {
        event.reply("bootstrap-response", error);
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
          "Application Support",
          "ZeroTier",
          "One"
        );
        break;

      case "win32":
        workingDirectory = path.join("/ProgramData", "ZeroTier", "One");
        break;

      case "linux":
        workingDirectory = path.join("/var", "lib", "zerotier-one");
        break;

      case "freebsd":
      case "openbsd":
        workingDirectory = path.join("/var", "db", "zerotier-one");
    }

    sudo.exec(
      `cat "${workingDirectory}/authtoken.secret"`,
      {
        name: "ZeroTier Utility",
      },
      (error, stdout) => {
        if (error) {
          throw new Error(error);
        }
        localAuthtoken = stdout;
        return resolve();
      }
    );
  });
}
