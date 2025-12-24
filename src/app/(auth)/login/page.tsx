"use client"

import Link from "next/link"
import { useState } from "react"

export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1>Logar</h1>
                <form>
                    <div>
                        <label>Nome de Usuário</label>
                        <input
                            value={formData.username}
                        ></input>
                    </div>
                    <div>
                        <label>Senha</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                        ></input>
                    </div>
                    <button
                        type="submit"    
                    >
                        Entrar
                    </button>
                    <Link href="/register">Criar conta</Link>
                </form>
            </div>
		</div>
    )
}