import dotenv from "dotenv";
dotenv.config();

import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

// Логін
router.post("/login", async (req, res) => {
  const { loginOrEmail, password } = req.body;
  console.log("loginOrEmail:", loginOrEmail);
  console.log("password:", password);

  try {
    const user = await User.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    console.log("Знайдений користувач:", user);

    if (!user) {
      console.log("User not found for:", loginOrEmail);
      return res.status(400).json({ error: "Користувача не знайдено" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Неправильний пароль" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        avatarUrl: user.avatarUrl,
        followers: user.followers,
        awards: user.awards,
        followedBy: user.followedBy,
      },
    });
  } catch (err) {
    console.error("Login route error:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
router.post("/register", async (req, res) => {
  const { firstName, lastName, login, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { login }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "Користувач вже існує" });
    }
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      login,
      email,
      password, // Використовуємо хешування в middleware моделі
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        login: newUser.login,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
//  Отримати поточного користувача (авторизація через JWT)
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Користувач не авторизований" });
    }
    res.json({
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      login: req.user.login,
      avatarUrl: req.user.avatarUrl,
      followers: req.user.followers,
      awards: req.user.awards,
      followedBy: req.user.followedBy,
    });
  }
);

export default router;
