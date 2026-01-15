import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as string | undefined) || "7d",
  CORS_ORIGINS: process.env.CORS_ORIGINS || "http://localhost:3000"
};

