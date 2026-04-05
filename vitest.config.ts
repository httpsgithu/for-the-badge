import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        coverage: { reporter: ["text", "lcov"] },
        setupFiles: ["./tests/setup/runtime.ts"]
    },
    resolve: {
        alias: {
            "~": path.resolve(__dirname),
            "#app": path.resolve(__dirname, "app"),
            "#server": path.resolve(__dirname, "server")
        }
    }
});
