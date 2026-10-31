# VYSESYSTEM - DESKTOP

Aplicativo desktop do VYSESYSTEM para o caixa, feito com Electron, React e Vite ([electron-vite](https://electron-vite.org)). Roda no Windows, no macOS e no Linux.

O desktop não acessa o banco de dados: ele é um cliente da API do app web (`apps/web`), igual ao navegador. Por isso o web precisa estar rodando, localmente ou publicado.

## Rodando

Na raiz do monorepo, com o web já rodando (`npm run dev`):

```bash
npm run dev:desktop
```

Entre com o mesmo usuário do web (no banco de demonstração: `caio` / `12345678`).

### Apontando para outro servidor

O app usa `http://localhost:3000` por padrão. Para trocar:

- **No build:** copie `.env.example` para `.env` e ajuste `MAIN_VITE_API_URL`. O valor fica embutido no app gerado.
- **Ao abrir o app:** defina a variável de ambiente `VYSE_API_URL`, que tem prioridade sobre a do build.

Em produção, use sempre uma URL `https://`.

### Modo quiosque

Para um computador dedicado ao caixa, abra o app com `--kiosk`: ele ocupa a tela inteira, sem bordas nem barra de título.

## Gerando o instalador

```bash
npm run dist:desktop
```

O instalador do sistema atual sai em `apps/desktop/release`: `.exe` (NSIS) no Windows, `.dmg` no macOS e `.AppImage` no Linux. Para gerar de outro sistema, use `npm run dist:win`, `dist:mac` ou `dist:linux` dentro de `apps/desktop`. Normalmente cada um precisa ser gerado no próprio sistema (ou num CI com runners de cada um). As configurações ficam em `electron-builder.yml`.

### Como as requisições funcionam

As telas usam as mesmas funções do web, vindas de `@vysesystem/api-client` (`getProducts`, `createSale`...). Em `src/renderer/src/main.tsx`, o transporte dessas funções é trocado por `window.vyse.api.request`, que manda a requisição por IPC para o processo principal. Lá, `src/main/api.ts`:

1. aceita só caminhos `/api/...` e os métodos HTTP conhecidos;
2. envia a requisição para a URL configurada, anexando o cookie de sessão;
3. guarda o novo token quando a API manda `Set-Cookie` no login, e o apaga no logout ou quando a sessão expira.

Assim o token nunca chega ao JavaScript da página (o mesmo papel do cookie `httpOnly` no navegador). A API do web não precisou de nenhuma mudança.

### Segurança

- A janela roda com `sandbox`, `contextIsolation` e sem `nodeIntegration`: a página não tem acesso ao Node nem ao `ipcRenderer`.
- O IPC só responde à página do próprio app. A navegação para outras origens é bloqueada, e links `https://` abrem no navegador padrão.
- O token é salvo com `safeStorage` (DPAPI no Windows, Keychain no macOS, libsecret no Linux). Sem um chaveiro disponível (ex.: Linux sem gnome-keyring/kwallet), a sessão vale só enquanto o app estiver aberto.
- O app abre uma única instância por computador.

### Próximos passos

- Impressão do cupom na impressora térmica (ESC/POS) e abertura da gaveta
- Modo offline: registrar vendas sem internet (SQLite) e sincronizar depois
- Atualização automática com `electron-updater` publicando nas Releases do GitHub

by caiothedev<br/>
#desktop