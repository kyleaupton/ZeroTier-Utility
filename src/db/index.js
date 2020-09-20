const { app } = require("electron");
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const userDataPath = app.getPath("userData");
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath);
}

const adapter = new FileSync(`${userDataPath}/db.json`);
const db = low(adapter);

db.defaults({
  auth: {
    authTokens: [],
    currentAuthToken: "",
  },
  favorites: [],
}).write();

export default db;
