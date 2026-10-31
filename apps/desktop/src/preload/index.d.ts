import type { VyseBridge } from "../shared/bridge"

declare global {
    interface Window {
        vyse: VyseBridge
    }
}