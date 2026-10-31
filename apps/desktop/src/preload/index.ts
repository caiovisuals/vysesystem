import { contextBridge, ipcRenderer } from "electron"
import { API_REQUEST_CHANNEL, type VyseBridge } from "../shared/bridge"

// A versão do app vem do processo principal via additionalArguments (o preload em sandbox não lê o package.json)
const appVersion = process.argv.find(arg => arg.startsWith("--vyse-version="))?.split("=")[1] ?? ""

// O preload roda em sandbox: expõe só funções pontuais, nunca o ipcRenderer inteiro
const bridge: VyseBridge = {
    api: {
        request: (path, init) => ipcRenderer.invoke(API_REQUEST_CHANNEL, path, init),
    },
    platform: process.platform,
    versions: {
        app: appVersion,
        electron: process.versions.electron,
    },
}

contextBridge.exposeInMainWorld("vyse", bridge)