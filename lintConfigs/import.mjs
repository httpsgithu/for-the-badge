// eslint-disable-next-line import/extensions
import { defineFlatConfigs } from "../.nuxt/eslint.config.mjs";

export default defineFlatConfigs({
    rules: {
        // Static analysis
        "import/no-unresolved": "error",
        "import/named": "error",
        "import/default": "error",
        "import/namespace": "error",
        "import/no-namespace": "error",
        "import/export": "error",
        "import/extensions": [
            "error",
            "never",
            {
                "*.json": "always",
                "*.y?(a)ml": "always",
            },
        ],
        "import/no-restricted-paths": [
            "error",
            {
                zones: [
                    { target: "../app", from: "../server" },
                    { target: "../server", from: "../app" },
                ],
            },
        ],
        "import/no-internal-modules": "off",
        "import/group-exports": "off",
        "import/no-relative-packages": "error",
        "import/no-relative-parent-imports": "off",
        "import/consistent-type-specifier-style": "off",
        "import/no-self-import": "error",
        "import/no-cycle": "error",
        "import/no-named-as-default": "warn",
        "import/no-named-as-default-member": "warn",
        "import/no-anonymous-default-export": [
            "error",
            {
                allowArray: false,
                allowArrowFunction: false,
                allowAnonymousClass: false,
                allowAnonymousFunction: false,
                allowCallExpression: true, // The true value here is for backward compatibility
                allowNew: false,
                allowLiteral: false,
                allowObject: true,
            },
        ],
        "import/no-rename-default": "warn",
        "import/no-unused-modules": "off", // Only compatible with legacy configs, should be disabled in new flat-configs
        "import/newline-after-import": ["warn", { count: 1 }],
        "import/no-duplicates": ["error"],

        // Module systems
        "import/no-commonjs": "error",
        "import/no-amd": "error",
        "import/no-dynamic-require": "error",
        "import/no-import-module-exports": "error",

        // Path management
        "import/max-dependencies": ["warn", { max: 12, ignoreTypeImports: true }],
        "import/no-extraneous-dependencies": "off", // Nuxt hides some accessible dependencies
        "import/no-absolute-path": "error",
        "import/no-nodejs-modules": "off", // Cannot enforce only in browser code unfortunately
        "import/no-webpack-loader-syntax": "error",
        "import/no-useless-path-segments": "warn",
        "import/no-unassigned-import": "warn",
        "import/dynamic-import-chunkname": "error",

        // Export rules
        "import/exports-last": "warn",
        "import/no-empty-named-blocks": "warn",

        // Stylistic / preferences
        "import/prefer-default-export": "warn",
        "import/prefer-namespace-import": "off",
        "import/no-default-export": "off",
        "import/no-named-export": "off",
        "import/unambiguous": "off",
        "import/order": [
            "error",
            {
                "groups": [
                    "builtin",
                    "external",
                    "internal",
                    [
                        "parent",
                        "sibling",
                        "index",
                    ],
                ],
                "newlines-between": "always",
                "alphabetize": { order: "asc", caseInsensitive: true },
            },
        ],

        // Deprecation
        "import/no-deprecated": "warn",
    },
});