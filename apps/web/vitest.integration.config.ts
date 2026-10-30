import { defineConfig } from "vitest/config"
import baseConfig from "./vitest.config"

// Testes de integração: usam o Postgres de DATABASE_URL (que precisa ser um banco de teste, ver tests/integration/setup.ts)
export default defineConfig({
    ...baseConfig,
    test: {
        ...baseConfig.test,
        include: ["tests/integration/**/*.test.ts"],
        setupFiles: ["tests/integration/setup.ts"],
        // Todos os arquivos usam o mesmo banco e o limpam entre os testes
        fileParallelism: false,
        testTimeout: 20_000,
    },
})