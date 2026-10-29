import fs from "fs"
import { User } from "@vysesystem/types"
import { hashPassword, verifyPassword, needsRehash } from "@/_lib/password"
import { verifySessionToken } from "@/_lib/session"

const FILE_PATH = "@/_mocks/users.json"

export let users: User[] = []

if (fs.existsSync(FILE_PATH)) {
    users = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"))
}

function loadUsers(): User[] {
    if (!fs.existsSync(FILE_PATH)) return []
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"))
}

export function saveUsers() {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2))
}

export async function registerUser(
    name: string, 
    username: string, 
    email: string, 
    password: string
): Promise<Omit<User, "password">> {
    const users = loadUsers()
    const userExists = users.find(
        u => u.username === username || u.email === email
    )

    if (userExists) {
        if (userExists.username === username) {
            throw new Error("Nome de usuário já está em uso")
        }
        throw new Error("Usuário já existe")
    }

    const hashedPassword = await hashPassword(password)

    const newUser: User = {
        id: crypto.randomUUID(),
        name,
        username,
        email,
        password: hashedPassword,
        companies: [],
        activeCompanyId: "",
    }

    users.push(newUser)
    saveUsers()

    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
}

export async function loginUser(
    username: string, 
    password: string
): Promise<Omit<User, 'password'>> {
    const user = users.find(u => u.username === username)

    if (!user) {
        throw new Error("Credenciais inválidas")
    }

    if (!user) {
        throw new Error("Credenciais inválidas")
    }

    const passwordMatch = await verifyPassword(password, user.password)

    if (!passwordMatch) {
        throw new Error("Senha incorreta")
    }

    if (needsRehash(user.password)) {
        user.password = await hashPassword(password)
        saveUsers()
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
}

export function getUserById(id: string) {
    const user = loadUsers().find(u => u.id === id)
    return user
}

export async function getUserFromSession(token: string | undefined) {
    const session = await verifySessionToken(token)
    if (!session) return null

    const user = getUserById(session.sub)
    if (!user || (user.sessionVersion ?? 0) !== session.ver) return null

    return user
}

export async function resetPassword(
    username: string, 
    email: string,
    newPassword: string
): Promise<{ success: boolean; message: string }> {
    const users = loadUsers()
    const user = users.find(
        u => u.username === username && u.email === email
    )

    if (!user) {
        throw new Error("Credenciais inválidas")
    }

    user.password = await hashPassword(newPassword)
    user.sessionVersion = (user.sessionVersion ?? 0) + 1
    saveUsers()

    return {
        success: true,
        message: "Senha alterada com sucesso"
    }
}

export function verifyUserCredentials(
    username: string,
    email: string
): boolean {
    const user = users.find(
        u => u.username === username && u.email === email
    )
    return !!user
}