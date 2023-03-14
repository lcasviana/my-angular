import javascript from "@eslint/js";
import angular from "angular-eslint";
import typescript from "typescript-eslint";

export default typescript.config(
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
