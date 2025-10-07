import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Отримуємо __dirname у ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../static/index.html"));
});

export default router;
