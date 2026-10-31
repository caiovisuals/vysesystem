import { afterEach, describe, expect, it, vi } from "vitest"
import { sendPasswordResetEmail } from "@/_lib/mail"

const URL_RESET = "https://app.exemplo.com/reset-password?token=abc&x=<b>"

describe("sendPasswordResetEmail", () => {
    afterEach(() => {
        vi.unstubAllEnvs()
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it("envia pelo Resend quando a chave e o remetente estão definidos", async () => {
        vi.stubEnv("RESEND_API_KEY", "re_teste")
        vi.stubEnv("MAIL_FROM", "VyseSystem <nao-responda@exemplo.com>")
        const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }))
        vi.stubGlobal("fetch", fetchMock)

        await sendPasswordResetEmail("caio@exemplo.com", URL_RESET)

        expect(fetchMock).toHaveBeenCalledOnce()
        const [endpoint, init] = fetchMock.mock.calls[0]
        expect(endpoint).toBe("https://api.resend.com/emails")
        expect(init.headers.Authorization).toBe("Bearer re_teste")
        const body = JSON.parse(init.body)
        expect(body.to).toEqual(["caio@exemplo.com"])
        expect(body.from).toBe("VyseSystem <nao-responda@exemplo.com>")
        expect(body.text).toContain(URL_RESET)
        // O link vai escapado no HTML
        expect(body.html).toContain("token=abc&amp;x=&lt;b&gt;")
        expect(body.html).not.toContain("<b>")
    })

    it("não lança erro quando o Resend falha", async () => {
        vi.stubEnv("RESEND_API_KEY", "re_teste")
        vi.stubEnv("MAIL_FROM", "nao-responda@exemplo.com")
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("erro", { status: 500 })))
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

        await expect(sendPasswordResetEmail("caio@exemplo.com", URL_RESET)).resolves.toBeUndefined()
        expect(errorSpy).toHaveBeenCalled()
    })

    it("sem provedor, em desenvolvimento mostra o link no terminal", async () => {
        vi.stubEnv("RESEND_API_KEY", "")
        vi.stubEnv("NODE_ENV", "development")
        const fetchMock = vi.fn()
        vi.stubGlobal("fetch", fetchMock)
        const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {})

        await sendPasswordResetEmail("caio@exemplo.com", URL_RESET)

        expect(fetchMock).not.toHaveBeenCalled()
        expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining(URL_RESET))
    })
})