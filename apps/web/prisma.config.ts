import { loadEnvConfig } from "@next/env"
import { defineConfig } from "prisma/config"

// Lê o .env.local do app, assim como o Next.js
loadEnvConfig(process.cwd())

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "tsx prisma/seed.ts",
    },
    datasource: {
        // Só é exigida por comandos que acessam o banco (migrate, studio, seed)
        url: process.env.DATABASE_URL,
    },
})