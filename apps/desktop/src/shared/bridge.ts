import type { ApiRequestInit, ApiResponse } from "@vysesystem/api-client"

// Contrato entre o preload e a página: tudo o que o renderer pode pedir ao processo principal passa por aqui
export const API_REQUEST_CHANNEL = "api:request"

export type VyseBridge = {
    api: {
        request: (path: string, init: ApiRequestInit) => Promise<ApiResponse>
    }
    platform: string
    versions: {
        app: string
        electron: string
    }
}