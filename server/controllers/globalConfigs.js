import GlobalConfig from "../models/GlobalConfig.js";
import queryCreator from "../commonHelpers/queryCreator.js";
import _ from "lodash";

// Create a new config
export const addConfig = async (req, res) => {
  try {
    const existing = await GlobalConfig.findOne({
      customId: req.body.customId,
    });

    if (existing) {
      return res.status(400).json({
        message: `Config with customId "${existing.customId}" already exists`,
      });
    }

    const configData = _.cloneDeep(req.body);
    const newConfig = new GlobalConfig(queryCreator(configData));

    const savedConfig = await newConfig.save();
    res.status(200).json(savedConfig);
  } catch (err) {
    res.status(400).json({
      message: `Error happened on server: "${err}"`,
    });
  }
};

// Update a config
export const updateConfig = async (req, res) => {
  try {
    const existing = await GlobalConfig.findOne({
      customId: req.params.customId,
    });

    if (!existing) {
      return res.status(400).json({
        message: `Config with customId "${req.params.customId}" is not found.`,
      });
    }

    const updatedData = queryCreator(_.cloneDeep(req.body));

    const updatedConfig = await GlobalConfig.findOneAndUpdate(
      { customId: req.params.customId },
      { $set: updatedData },
      { new: true }
    );

    res.json(updatedConfig);
  } catch (err) {
    res.status(400).json({
      message: `Error happened on server: "${err}"`,
    });
  }
};

// Delete a config
export const deleteConfig = async (req, res) => {
  try {
    const config = await GlobalConfig.findOne({
      customId: req.params.customId,
    });

    if (!config) {
      return res.status(400).json({
        message: `Config with customId "${req.params.customId}" is not found.`,
      });
    }

    await GlobalConfig.deleteOne({ customId: req.params.customId });

    res.status(200).json({
      message: `Config with customId "${config.customId}" is successfully deleted from DB.`,
    });
  } catch (err) {
    res.status(400).json({
      message: `Error happened on server: "${err}"`,
    });
  }
};

// Get all configs
export const getConfigs = async (req, res) => {
  try {
    const configs = await GlobalConfig.find();
    res.status(200).json(configs);
  } catch (err) {
    res.status(400).json({
      message: `Error happened on server: "${err}"`,
    });
  }
};

// Get a config by customId
export const getConfigById = async (req, res) => {
  try {
    const config = await GlobalConfig.findOne({
      customId: req.params.customId,
    });
    res.status(200).json(config);
  } catch (err) {
    res.status(400).json({
      message: `Error happened on server: "${err}"`,
    });
  }
};
