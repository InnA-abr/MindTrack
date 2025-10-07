import express from "express";
import passport from "passport";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  getPostsByUserId,
} from "../controllers/post.js";

const router = express.Router();
router.post("/", passport.authenticate("jwt", { session: false }), createPost);
router.get("/", getPosts);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updatePost
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deletePost
);

router.get("/user/:userId", getPostsByUserId);

export default router;
