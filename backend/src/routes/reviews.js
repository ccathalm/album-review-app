const express = require("express");
const { getDb } = require("../db");
const { reviewCreateSchema } = require("../validators");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await getDb();
  const userId = req.query.userId ? parseInt(req.query.userId, 10) : null;
  const albumId = req.query.albumId ? parseInt(req.query.albumId, 10) : null;

  const where = [];
  const params = [];
  if (userId) { where.push("r.user_id = ?"); params.push(userId); }
  if (albumId) { where.push("r.album_id = ?"); params.push(albumId); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const rows = await db.all(
    `SELECT r.id, r.score, r.review_text, r.created_at, r.updated_at,
            a.id as album_id, a.title, a.artist,
            u.id as user_id, u.display_name
     FROM reviews r
     JOIN albums a ON a.id = r.album_id
     JOIN users u ON u.id = r.user_id
     ${whereSql}
     ORDER BY r.created_at DESC`,
    params
  );

  res.json({ reviews: rows });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = reviewCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { album_id, score, review_text } = parsed.data;
  const db = await getDb();

  const existing = await db.get(
    "SELECT id FROM reviews WHERE user_id = ? AND album_id = ?",
    [req.user.id, album_id]
  );
  if (existing) return res.status(409).json({ error: "You already reviewed this album" });

  const result = await db.run(
    `INSERT INTO reviews (user_id, album_id, score, review_text) VALUES (?, ?, ?, ?)`,
    [req.user.id, album_id, score, review_text ?? null]
  );

  const created = await db.get("SELECT * FROM reviews WHERE id = ?", [result.lastID]);
  res.status(201).json({ review: created });
});

router.put("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = reviewCreateSchema.omit({ album_id: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const db = await getDb();
  const review = await db.get("SELECT * FROM reviews WHERE id = ?", [id]);
  if (!review) return res.status(404).json({ error: "Review not found" });

  const isOwner = review.user_id === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

  const { score, review_text } = parsed.data;

  await db.run(
    "UPDATE reviews SET score=?, review_text=?, updated_at=datetime('now') WHERE id=?",
    [score, review_text ?? null, id]
  );

  const updated = await db.get("SELECT * FROM reviews WHERE id = ?", [id]);
  res.json({ review: updated });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = await getDb();

  const review = await db.get("SELECT * FROM reviews WHERE id = ?", [id]);
  if (!review) return res.status(404).json({ error: "Review not found" });

  const isOwner = review.user_id === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

  await db.run("DELETE FROM reviews WHERE id = ?", [id]);
  res.json({ ok: true });
});

module.exports = router;
