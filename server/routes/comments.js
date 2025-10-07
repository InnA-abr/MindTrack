import express from "express";
import passport from "passport";
import {
  addComment,
  updateComment,
  deleteComment,
  getAllComments,
  getUserComments,
  getPostComments,
} from "../controllers/comments.js";

const router = express.Router();

// Додавання коментаря (приватно)
router.post("/", passport.authenticate("jwt", { session: false }), addComment);

// Оновлення, видалення - приватні
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateComment
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);

// Отримання коментарів - публічно
router.get("/", getAllComments);
router.get("/user/:userId", getUserComments);
router.get("/post/:postId", getPostComments);

export default router;
