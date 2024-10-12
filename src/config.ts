import { merge } from "es-toolkit";
import configData from "../config.json";

const DEFAULT_CONFIG = {
  TELEGRAM: {
    TOKEN: "unknown",
  },
} as const;

export const CONFIG = merge(DEFAULT_CONFIG, configData);
