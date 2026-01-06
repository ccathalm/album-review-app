require("dotenv").config();
const { getDb } = require("./db");
const bcrypt = require("bcrypt");

(async () => {
  const db = await getDb();

  const adminPass = "Admin123!";
  const userPass = "User123!";

  const adminHash = await bcrypt.hash(adminPass, 10);
  const userHash = await bcrypt.hash(userPass, 10);

  await db.run("PRAGMA foreign_keys = ON;");

  await db.exec(`
    DELETE FROM reviews;
    DELETE FROM albums;
    DELETE FROM users;
  `);

  const admin = await db.run(
    `INSERT INTO users (email, display_name, password_hash, role) VALUES (?, ?, ?, ?)`,
    ["admin@example.com", "Admin", adminHash, "admin"]
  );

  const user = await db.run(
    `INSERT INTO users (email, display_name, password_hash, role) VALUES (?, ?, ?, ?)`,
    ["user@example.com", "Test User", userHash, "user"]
  );

  await db.run(
    `INSERT INTO albums (title, artist, release_year, genre) VALUES (?, ?, ?, ?)`,
    ["In Rainbows", "Radiohead", 2007, "Alternative"]
  );
  await db.run(
    `INSERT INTO albums (title, artist, release_year, genre) VALUES (?, ?, ?, ?)`,
    ["Random Access Memories", "Daft Punk", 2013, "Electronic"]
  );
  await db.run(
    `INSERT INTO albums (title, artist, release_year, genre) VALUES (?, ?, ?, ?)`,
    ["To Pimp a Butterfly", "Kendrick Lamar", 2015, "Hip-Hop"]
  );

  await db.close();
  console.log("✅ Seed complete.");
  console.log("Login accounts:");
  console.log("  admin@example.com / Admin123!");
  console.log("  user@example.com  / User123!");
})();
