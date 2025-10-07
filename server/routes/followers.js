import express from "express";
import passport from "passport";

import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "../controllers/followers.js";

const router = express.Router();

// Всі маршрути вимагають аутентифікацію (JWT)
router.use(passport.authenticate("jwt", { session: false }));

// Отримати підписників користувача
router.get("/followers/:userId", getFollowers);

// Отримати на кого підписаний користувач
router.get("/following/:userId", getFollowing);

// Підписатися на користувача
router.post("/follow/:userId", followUser);

// Відписатися від користувача
router.post("/unfollow/:userId", unfollowUser);

export default router;
