import { app, BrowserWindow, ipcMain, shell } from "electron"
import { join } from "node:path"
import { API_REQUEST_CHANNEL } from "../shared/bridge"
import { apiRequest } from "./api"
import { loadSession } from "./session"

// Modo quiosque para o caixa: abre em tela cheia sem bordas (ex.: `VyseSystem --kiosk`)
const KIOSK = process.argv.includes("--kiosk")

let mainWindow: BrowserWindow | null = null

function isAppUrl(url: string) {
    const devUrl = process.env.ELECTRON_RENDERER_URL
    return devUrl ? url.startsWith(devUrl) : url.startsWith("file://")
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 680,
        show: false,
        kiosk: KIOSK,
        autoHideMenuBar: true,
        backgroundColor: "#131313",
        title: "VyseSystem",
        icon: join(__dirname, "../../resources/icon.png"),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: true,
            contextIsolation: true,
            nodeIntegration: false,
            additionalArguments: [`--vyse-version=${app.getVersion()}`],
        },
    })

    mainWindow.once("ready-to-show", () => mainWindow?.show())
    mainWindow.on("closed", () => {
        mainWindow = null
    })

    // A janela só mostra o próprio app; links externos (https) abrem no navegador padrão
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https://")) shell.openExternal(url)
        return { action: "deny" }
    })
    mainWindow.webContents.on("will-navigate", (event, url) => {
        if (!isAppUrl(url)) event.preventDefault()
    })

    if (process.env.ELECTRON_RENDERER_URL) {
        mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
    }
}

// Um único caixa aberto por máquina: abrir de novo só traz a janela existente para frente
if (!app.requestSingleInstanceLock()) {
    app.quit()
} else {
    app.on("second-instance", () => {
        if (!mainWindow) return
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
    })

    app.whenReady().then(() => {
        loadSession()

        // Só a página do próprio app pode usar a ponte com a API
        ipcMain.handle(API_REQUEST_CHANNEL, (event, path: unknown, init: unknown) => {
            if (!event.senderFrame || !isAppUrl(event.senderFrame.url)) {
                return { ok: false, status: 403, data: { message: "Origem não autorizada" } }
            }
            return apiRequest(path, init)
        })

        createWindow()

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit()
    })
}