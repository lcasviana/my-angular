import eslintJs from "@eslint/js";
import eslintTs from "typescript-eslint";

export default [eslintJs.configs.recommended, ...eslintTs.configs.recommended, { ignores: ["dist", "node_modules"] }];
