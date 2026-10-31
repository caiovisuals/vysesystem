import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { setTransport } from "@vysesystem/api-client"
import App from "./App"
import "./styles.css"

// As requisições do @vysesystem/api-client passam pelo processo principal (veja src/main/api.ts)
setTransport(window.vyse.api.request)

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 30_000, refetchOnWindowFocus: false },
    },
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
)