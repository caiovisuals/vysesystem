import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    transpilePackages: ["@vysesystem/types"],
    serverExternalPackages: ["@electric-sql/pglite"],
}

export default nextConfig
