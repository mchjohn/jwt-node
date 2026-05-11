import "dotenv/config";
import { defineConfig } from "prisma/config";
import { ENV } from "./src/config/env.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {url: ENV.JWT_SECRET},
});
