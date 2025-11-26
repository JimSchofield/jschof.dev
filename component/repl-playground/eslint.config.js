import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginLit from "eslint-plugin-lit";

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    ignores: ["node_modules/", "dist/", "_site/"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      lit: eslintPluginLit,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...eslintPluginLit.configs.recommended.rules,
      
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      
      // Lit specific rules
      "lit/no-classfield-shadowing": "error",
      "lit/no-invalid-html": "error",
      "lit/no-useless-template-literals": "error",
      "lit/attribute-value-entities": "error",
      
      // General rules
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
    },
  },
  // Apply Prettier config last to disable conflicting rules
  eslintConfigPrettier,
];