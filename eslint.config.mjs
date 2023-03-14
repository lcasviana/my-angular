import javascript from "@eslint/js";
import angular from "angular-eslint";
import { defineConfig } from "eslint/config";
import typescript from "typescript-eslint";

export default defineConfig(
  {
    files: ["**/*.ts"],
    extends: [javascript.configs.recommended, ...typescript.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);
