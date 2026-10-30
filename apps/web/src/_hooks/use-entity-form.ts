"use client"

import { useCallback, useState } from "react"
import { z } from "zod"

// Converte o texto de um input numérico; vazio vira undefined para o schema decidir se é obrigatório
export function toNumber(value: string): number | undefined {
    const trimmed = value.trim()
    return trimmed === "" ? undefined : Number(trimmed.replace(",", "."))
}

interface UseEntityFormProps<TValues extends Record<string, string>, TSchema extends z.ZodType> {
    schema: TSchema
    initialValues: TValues
    // Monta o corpo da requisição a partir dos valores (texto) do formulário
    toInput: (values: TValues) => z.input<TSchema>
}

// Estado de um formulário de cadastro validado no cliente com o mesmo schema Zod da API
export function useEntityForm<TValues extends Record<string, string>, TSchema extends z.ZodType>({
    schema,
    initialValues,
    toInput,
}: UseEntityFormProps<TValues, TSchema>) {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState<Partial<Record<keyof TValues, string>>>({})

    // Props para ligar um input/select a um campo: <input {...field("name")} />
    function field(name: keyof TValues & string) {
        return {
            name,
            value: values[name],
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                const { value } = e.target
                setValues(prev => ({ ...prev, [name]: value }))
                setErrors(prev => ({ ...prev, [name]: undefined }))
            },
        }
    }

    // Retorna o corpo pronto para a API, ou null (e preenche os erros) se algo for inválido
    function validate(): z.input<TSchema> | null {
        const input = toInput(values)
        const result = schema.safeParse(input)
        if (result.success) {
            setErrors({})
            return input
        }

        const fieldErrors = z.flattenError(result.error).fieldErrors as Record<string, string[] | undefined>
        setErrors(Object.fromEntries(
            Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0]]),
        ) as Partial<Record<keyof TValues, string>>)
        return null
    }

    // Estável entre renderizações: pode ir nas dependências de um useEffect
    const reset = useCallback((next: TValues) => {
        setValues(next)
        setErrors({})
    }, [])

    return { values, errors, field, validate, reset }
}