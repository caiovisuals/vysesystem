import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { login } from "@vysesystem/api-client"
import { loginSchema } from "@vysesystem/schemas"
import { meQueryKey } from "@/queries"
import logo from "@/logo.png"

type LoginForm = z.input<typeof loginSchema>

export default function Login() {
    const queryClient = useQueryClient()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

    const signIn = useMutation({
        mutationFn: ({ username, password }: LoginForm) => login(username, password),
        onSuccess: user => queryClient.setQueryData(meQueryKey, user),
    })

    const error = errors.username?.message ?? errors.password?.message ?? signIn.error?.message

    return (
        <main className="flex h-full items-center justify-center">
            <form
                onSubmit={handleSubmit(data => signIn.mutate(data))}
                className="flex w-[420px] flex-col gap-5 rounded-2xl border border-foreground bg-second-background p-10"
            >
                <img src={logo} alt="VyseSystem" className="mx-auto h-16" />
                <h1 className="text-center text-2xl">Entrar no caixa</h1>
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-sub-text">Usuário</span>
                    <input {...register("username")} autoFocus className="rounded-lg border border-middleground bg-background px-3 py-2.5 outline-none focus:border-text-head" />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-sub-text">Senha</span>
                    <input {...register("password")} type="password" className="rounded-lg border border-middleground bg-background px-3 py-2.5 outline-none focus:border-text-head" />
                </label>
                {error && <span role="alert" className="text-sm text-red-400">{error}</span>}
                <button
                    type="submit"
                    disabled={signIn.isPending}
                    className="rounded-lg bg-text-head py-2.5 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                    {signIn.isPending ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </main>
    )
}