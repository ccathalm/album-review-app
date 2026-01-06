require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { getDb } = require("./db");

(async () => {
  const db = await getDb();
  const schema = fs.readFileSync(path.resolve(__dirname, "../../db/schema.sql"), "utf-8");
  await db.exec(schema);
  await db.close();
  console.log("✅ DB schema created/updated.");
})();
