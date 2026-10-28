import { defineConfig } from "drizzle-kit"

const databaseUrl = process.env.DATABASE_URL

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/_lib/db/schema.ts",
    out: "./drizzle",
    // Sem DATABASE_URL, o drizzle-kit (ex.: db:studio) abre o banco local do PGlite
    ...(databaseUrl
        ? { dbCredentials: { url: databaseUrl } }
        : { driver: "pglite", dbCredentials: { url: process.env.PGLITE_DATA_DIR || "./data/pglite" } }),
})