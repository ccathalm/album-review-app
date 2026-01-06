const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function getDb() {
  const dbPath = process.env.DB_PATH || "../db/app.sqlite";
  return open({
    filename: path.resolve(__dirname, dbPath),
    driver: sqlite3.Database
  });
}

module.exports = { getDb };
