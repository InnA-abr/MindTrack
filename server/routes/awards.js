import express from "express";
import passport from "passport";

import {
  addAward,
  updateAward,
  deleteAward,
  getAwards,
  getAwardById,
  getAwardByUserId,
} from "../controllers/awards.js";

const router = express.Router();

// @route   POST /api/awards
// @desc    Create new award
// @access  Private (admin)
router.post("/", passport.authenticate("jwt", { session: false }), addAward);

// @route   PUT /api/awards/:id
// @desc    Update existing award
// @access  Private (admin)
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateAward
);

// @route   DELETE /api/awards/:id
// @desc    Delete existing award
// @access  Private (admin)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteAward
);

// @route   GET /api/awards
// @desc    GET existing awards
// @access  Public
router.get("/", getAwards);

// @route   GET /api/awards/:id
// @desc    GET existing award by id
// @access  Public
router.get("/:id", getAwardById);

router.get("/user/:userId", getAwardByUserId);

export default router;
