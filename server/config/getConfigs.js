import GlobalConfig from "../models/GlobalConfig.js";

export default async () => {
  const configs = await GlobalConfig.findOne({ customId: "global-configs" });
  console.log("configs from getConfigs():", configs);
  return configs;
};
