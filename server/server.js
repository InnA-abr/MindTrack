import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import globalConfigs from "./routes/globalConfigs.js";
import users from "./routes/user.js";
import posts from "./routes/post.js";
import comments from "./routes/comments.js";
import awards from "./routes/awards.js";
import authRoutes from "./routes/auth.js";
import followersRouter from "./routes/followers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = process.env.MONGO_URI;
console.log("Mongo URI:", db);
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());

import passportConfig from "./config/passport.js";

async function startServer() {
  await passportConfig(passport);

  app.use("/api/configs", globalConfigs);
  app.use("/api/users", users);
  app.use("/api/posts", posts);
  app.use("/api/comments", comments);
  app.use("/api/awards", awards);
  app.use("/api/auth", authRoutes);

  app.use("/api/followers", followersRouter);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "client", "build")));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }

  const port = process.env.PORT || 5001;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer();
