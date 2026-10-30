import "server-only"
import { Prisma } from "@/generated/prisma/client"
import { HttpError } from "@/_lib/errors"

// O código é único por empresa (@@unique([companyId, code])); a violação vira um 409 legível
export function duplicateCodeError(error: unknown): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return new HttpError("Já existe um produto com esse código", 409)
    }
    return error
}