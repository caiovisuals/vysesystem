"use client"

import { useForm, type DefaultValues, type FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import type { z } from "zod"

interface UseFormMutationProps<TInput extends FieldValues, TOutput extends FieldValues> {
	schema: z.ZodType<TOutput, TInput>
	defaultValues: DefaultValues<TInput>
	// "data" já vem validado (e transformado) pelo schema
	onSubmit: (data: TOutput) => void | Promise<void>
	errorMessage?: string
}

export function useFormMutation<TInput extends FieldValues, TOutput extends FieldValues = TInput>({
	schema,
	defaultValues,
	onSubmit,
	errorMessage = "Erro ao processar a requisição!",
}: UseFormMutationProps<TInput, TOutput>) {
	const form = useForm<TInput, unknown, TOutput>({
		defaultValues,
		resolver: zodResolver<TInput, unknown, TOutput>(schema),
	})

	const handleSubmitForm = form.handleSubmit(async (data) => {
		try {
			await onSubmit(data)
		} catch (error) {
			toast.error(errorMessage)
			console.error(error)
		}
	})

	return { ...form, handleSubmitForm }
}