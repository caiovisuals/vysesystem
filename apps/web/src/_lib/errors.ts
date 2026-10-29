// Erro com status HTTP, lançado pelas rotas e convertido em resposta por handleError (em api.ts)
export class HttpError extends Error {
    constructor(message: string, public status: number) {
        super(message)
    }
}