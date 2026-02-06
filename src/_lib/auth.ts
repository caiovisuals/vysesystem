import { users } from "@/_mocks/user"
import { User } from "@/_types/user"

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
        password,
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

    return user
}
