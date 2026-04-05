import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./server/database/schema.single.ts",
    out: "./server/database/migrations",
});