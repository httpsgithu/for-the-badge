/* eslint-disable import/extensions */
import { withNuxt } from "./.nuxt/eslint.config.mjs";
import eslintRules from "./lintConfigs/eslint.mjs";
import importRules from "./lintConfigs/import.mjs";
import stylisticRules from "./lintConfigs/stylistic.mjs";
import typescriptRules from "./lintConfigs/typescript.mjs";
import vueRules from "./lintConfigs/vue.mjs";

export default withNuxt(
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                process: "readonly",
                window: "readonly",
                document: "readonly",
            },
        },
        ignores: [
            "./.data/**",
            "./.nuxt/**",
            "./.github/**",
            "./.vscode/**",
            "./.yarn/**",
        ],
    },
    importRules,
    eslintRules,
    stylisticRules,
    typescriptRules,
    vueRules
);