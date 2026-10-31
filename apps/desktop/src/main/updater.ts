import { app } from "electron"
import { autoUpdater } from "electron-updater"

// Verifica a cada 4 horas, além da verificação ao abrir o app
const CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000

// Atualização automática pelas Releases do GitHub (configuradas em `publish` no electron-builder.yml).
// A nova versão é baixada em segundo plano e instalada quando o app for fechado, para nunca
// reiniciar o caixa no meio de uma venda. Só roda no app instalado; desligue com VYSE_DISABLE_UPDATES=1.
export function setupAutoUpdates() {
    if (!app.isPackaged || process.env.VYSE_DISABLE_UPDATES === "1") return

    autoUpdater.logger = console
    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = true

    autoUpdater.on("update-downloaded", (info) => {
        console.info(`[UPDATER] Versão ${info.version} baixada; será instalada ao fechar o app.`)
    })
    autoUpdater.on("error", (error) => {
        console.error("[UPDATER] Falha ao verificar/baixar atualização:", error)
    })

    const check = () => {
        autoUpdater.checkForUpdatesAndNotify().catch(() => {
            // O erro já foi registrado pelo listener "error"
        })
    }

    check()
    setInterval(check, CHECK_INTERVAL_MS).unref()
}