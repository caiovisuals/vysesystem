import { users } from "@/_mocks/user"
import { User } from "@/_types/user"

function hashPassword(password: string) {
     return btoa(password)
}

function comparePassword(password: string, hash: string) {
    return btoa(password) === hash
}

export function registerUser( name: string, username: string, email: string, password: string ): User {
    const userExists = users.find(
        u => u.username === username || u.email === email
    )

    if (userExists) {
        throw new Error("Usuário já existe")
    }

    const newUser: User = {
        id: crypto.randomUUID(),
        name,
        username,
        email,
        password: hashPassword(password),
    }

    users.push(newUser)
    return newUser
}

export function loginUser(username: string, password: string): User {
    const user = users.find(
        u => u.username === username && u.password === password
    )

    if (!user) {
        throw new Error("Credenciais inválidas")
    }

    const passwordMatch = comparePassword(password, user.password)

    if (!passwordMatch) {
        throw new Error("Senha incorreta")
    }

    return user
}

export function ForgotPasswordUser(username: string, email: string): User {
    const user = users.find(
        u => u.username === username && u.email === email
    )

    if (!user) {
        throw new Error("Credenciais inválidas")
    }

    const resetToken = crypto.randomUUID()

    return user
}
