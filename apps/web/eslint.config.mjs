import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    {
        ignores: [".next/**", "node_modules/**"],
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // O projeto usa <img> com arquivos locais de /public
            "@next/next/no-img-element": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        },
    },
]

export default eslintConfig