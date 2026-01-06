const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getDb } = require("../db");
const { registerSchema, loginSchema } = require("../validators");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, display_name, password } = parsed.data;
  const db = await getDb();

  const existing = await db.get("SELECT id FROM users WHERE email = ?", [email]);
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const password_hash = await bcrypt.hash(password, 10);
  const result = await db.run(
    "INSERT INTO users (email, display_name, password_hash, role) VALUES (?, ?, ?, 'user')",
    [email, display_name, password_hash]
  );

  const token = jwt.sign({ id: result.lastID, role: "user", email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const db = await getDb();

  const user = await db.get("SELECT id, email, password_hash, role FROM users WHERE email = ?", [email]);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token });
});

router.get("/me", requireAuth, async (req, res) => {
  const db = await getDb();
  const me = await db.get("SELECT id, email, display_name, role, created_at FROM users WHERE id = ?", [req.user.id]);
  res.json({ user: me });
});

module.exports = router;
