import { useQuery } from "@tanstack/react-query"
import { getMe } from "@vysesystem/api-client"
import Login from "./screens/Login"
import Checkout from "./screens/Checkout"
import { meQueryKey } from "./queries"

export default function App() {
    // 401 (sem sessão ou sessão revogada) cai no erro e mostra o login
    const { data: user, isPending } = useQuery({ queryKey: meQueryKey, queryFn: getMe, retry: false })

    if (isPending) {
        return <div className="flex h-full items-center justify-center text-sub-text">Carregando...</div>
    }

    return user ? <Checkout user={user} /> : <Login />
}