require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const albumRoutes = require("./routes/albums");
const reviewRoutes = require("./routes/reviews");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/reviews", reviewRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ API running on http://localhost:${port}`));
