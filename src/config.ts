import { merge } from "es-toolkit";
//import configData from "../config.json";

import dotenv from "dotenv";

dotenv.config();
export const CONFIG = {
  ENV: process.env.ENVIRONMENT || "prod",
  TELEGRAM: {
    TOKEN: process.env.TELEGRAM_TOKEN,
  },
} as const;

// export const CONFIG = merge(DEFAULT_CONFIG, configData);
