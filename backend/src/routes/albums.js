const express = require("express");
const { getDb } = require("../db");
const { albumCreateSchema } = require("../validators");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize || "10", 10)));
  const search = (req.query.search || "").trim();

  const db = await getDb();

  const where = search ? "WHERE title LIKE ? OR artist LIKE ?" : "";
  const params = search ? [`%${search}%`, `%${search}%`] : [];

  const totalRow = await db.get(`SELECT COUNT(*) as total FROM albums ${where}`, params);
  const total = totalRow.total;

  const offset = (page - 1) * pageSize;
  const albums = await db.all(
    `SELECT id, title, artist, release_year, genre, created_at
     FROM albums
     ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  res.json({ page, pageSize, total, albums });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = await getDb();

  const album = await db.get("SELECT * FROM albums WHERE id = ?", [id]);
  if (!album) return res.status(404).json({ error: "Album not found" });

  const stats = await db.get(
    "SELECT COUNT(*) as reviewCount, AVG(score) as avgScore FROM reviews WHERE album_id = ?",
    [id]
  );

  const reviews = await db.all(
    `SELECT r.id, r.score, r.review_text, r.created_at, r.updated_at,
            u.id as user_id, u.display_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.album_id = ?
     ORDER BY r.created_at DESC`,
    [id]
  );

  res.json({ album, stats, reviews });
});

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = albumCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { title, artist, release_year, genre } = parsed.data;
  const db = await getDb();

  const result = await db.run(
    "INSERT INTO albums (title, artist, release_year, genre) VALUES (?, ?, ?, ?)",
    [title, artist, release_year ?? null, genre ?? null]
  );

  const created = await db.get("SELECT * FROM albums WHERE id = ?", [result.lastID]);
  res.status(201).json({ album: created });
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = albumCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const db = await getDb();
  const existing = await db.get("SELECT id FROM albums WHERE id = ?", [id]);
  if (!existing) return res.status(404).json({ error: "Album not found" });

  const { title, artist, release_year, genre } = parsed.data;

  await db.run(
    "UPDATE albums SET title=?, artist=?, release_year=?, genre=? WHERE id=?",
    [title, artist, release_year ?? null, genre ?? null, id]
  );

  const updated = await db.get("SELECT * FROM albums WHERE id = ?", [id]);
  res.json({ album: updated });
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = await getDb();
  await db.run("DELETE FROM albums WHERE id = ?", [id]);
  res.json({ ok: true });
});

module.exports = router;
