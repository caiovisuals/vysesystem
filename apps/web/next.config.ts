import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    transpilePackages: ["@vysesystem/types", "@vysesystem/schemas", "@vysesystem/api-client"],
}

export default nextConfig
