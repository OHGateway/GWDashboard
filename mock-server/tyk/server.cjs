const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.set("json spaces", 2);

// definitions.json 불러오기
const definitionsPath = path.join(__dirname, "data", "definitions.json");
let DEFINITIONS = [];
try {
  const file = fs.readFileSync(definitionsPath, "utf-8");
  DEFINITIONS = JSON.parse(file);
} catch (err) {
  console.error("❌ definitions.json 로드 실패:", err.message);
}

// Routes
app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/definitions", (req, res) => {
  res.json(DEFINITIONS);
});

app.get("/definitions/:api_id", (req, res) => {
  const found = DEFINITIONS.find(d => d.api_id === req.params.api_id);
  if (!found) return res.status(404).json({ error: "Not Found" });
  res.json(found);
});

app.get("/definitions/by-slug/:slug", (req, res) => {
  const found = DEFINITIONS.find(d => d.slug === req.params.slug);
  if (!found) return res.status(404).json({ error: "Not Found" });
  res.json(found);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Tyk demo definitions server running at http://localhost:${PORT}`);
});
