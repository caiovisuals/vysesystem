"use client"

import Link from "next/link"
import { useState } from "react"

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1>Cadastra-se</h1>
                <form>
                    <div>
                        <label>Nome</label>
                        <input
                            value={formData.name}
                        ></input>
                    </div>
                    <div>
                        <label>Nome de Usuário</label>
                        <input
                            value={formData.username}
                        ></input>
                    </div>
                    <div>
                        <label>E-mail</label>
                        <input
                            type="email"
                            value={formData.email}
                        ></input>
                    </div>
                    <div>
                        <label>Senha</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                        ></input>
                    </div>
                    <div>
                        <label>Confirmar Senha</label>
                        <input
                            value={formData.confirmPassword}
                        ></input>
                    </div>
                    <button
                        type="submit"    
                    >
                        Criar Conta
                    </button>
                    <Link href="/login">Entrar com uma conta</Link>
                </form>
            </div>
		</div>
    )
}