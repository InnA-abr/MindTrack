import express from "express";
import passport from "passport";

import {
  addConfig,
  updateConfig,
  deleteConfig,
  getConfigs,
  getConfigById,
} from "../controllers/globalConfigs.js";

const router = express.Router();

// @route   POST /configs
// @desc    Create new config
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt-admin", { session: false }),
  addConfig
);

// @route   PUT /configs/:customId
// @desc    Update existing config
// @access  Private
router.put(
  "/:customId",
  passport.authenticate("jwt-admin", { session: false }),
  updateConfig
);

// @route   DELETE /configs/:customId
// @desc    DELETE existing config
// @access  Private
router.delete(
  "/:customId",
  passport.authenticate("jwt-admin", { session: false }),
  deleteConfig
);

// @route   GET /configs
// @desc    GET existing configs
// @access  Public
router.get("/", getConfigs);

// @route   GET /configs/:customId
// @desc    GET existing config by id
// @access  Public
router.get("/:customId", getConfigById);

export default router;
