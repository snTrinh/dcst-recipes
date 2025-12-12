import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";
dotenv.config();

console.log("DB:", process.env.DATABASE_URL);

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});