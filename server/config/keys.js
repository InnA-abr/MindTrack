import * as keysProd from "./keys_prod.js";
import * as keysDev from "./keys_dev.js";

const config = process.env.NODE_ENV === "production" ? keysProd : keysDev;

export default config;
