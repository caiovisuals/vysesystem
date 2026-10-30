import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const src = fileURLToPath(new URL("./src", import.meta.url))

// Testes unitários: rodam sem banco. Os de integração ficam em vitest.integration.config.ts
export default defineConfig({
    resolve: {
        alias: {
            "@": src,
            // "server-only" lança erro fora do bundler do Next; nos testes vira um módulo vazio
            "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
        },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
})