import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

// Load environment variables
const dev = process.env.NODE_ENV !== "production";
loadEnvConfig("./", dev);

export default defineConfig({
  schema: "lib/db/schema.ts",
  out: "lib/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://default:HPCK5sScXY0o@ep-rough-star-a4kscv3b-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require"
  },
  verbose: true,
  strict: true,
});
