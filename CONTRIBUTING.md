# CONTRIBUIÇÃO

Obrigado pelo interesse em contribuir! O VYSESYSTEM é um projeto de estudo, sem fins lucrativos, então toda contribuição — de correção de texto a novas telas — é bem-vinda.

## Sumário

- [Código de conduta](#código-de-conduta)
- [Como posso contribuir?](#como-posso-contribuir)
- [Preparando o ambiente](#preparando-o-ambiente)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Padrões de código](#padrões-de-código)
- [Commits](#commits)
- [Pull requests](#pull-requests)
- [Segurança](#segurança)

## Código de conduta

Seja respeitoso e construtivo. Críticas são sobre o código, nunca sobre a pessoa. Comportamentos ofensivos ou discriminatórios não são tolerados.

## Como posso contribuir?

- **Reportar bugs** — abra uma issue usando o template *Bug*, com passos para reproduzir.
- **Sugerir funcionalidades** — abra uma issue com o template *Funcionalidade* e descreva o problema que ela resolve.
- **Enviar código** — escolha uma issue aberta (ou abra uma), comente que vai trabalhar nela e envie um pull request.
- **Melhorar a documentação** — README, comentários e a página `/documentation` do app web também contam.

Para mudanças grandes (nova tela, troca de biblioteca, mudança de arquitetura), abra uma issue antes para alinhar a ideia.

## Preparando o ambiente

Requisitos:

- **Node.js 22** (a versão está em `.nvmrc`; com nvm, rode `nvm use`)
- **npm 10+**
- Para o app mobile: o app **Expo Go** no celular, ou um emulador Android / simulador iOS

Passo a passo:

```bash
git clone https://github.com/caiovisuals/vysesystem.git
cd vysesystem
npm install
cp apps/web/.env.example apps/web/.env.local
```

Preencha `AUTH_SECRET` em `apps/web/.env.local` (gere com `openssl rand -hex 32`) e `DATABASE_URL` com a URL de um Postgres (para desenvolvimento, `npx prisma dev --detach` dentro de `apps/web` sobe um local e imprime a URL). `REDIS_URL` é opcional. Depois prepare o banco:

```bash
npm run db:migrate --workspace=vysesystem-web
npm run db:seed --workspace=vysesystem-web
```

Rode o app que for alterar:

```bash
npm run dev          # web em http://localhost:3000
npm run dev:mobile   # mobile via Expo
```

> Instale dependências sempre pela **raiz** do repositório. Rodar `npm install` dentro de `apps/*` cria um segundo `node_modules` e um `package-lock.json` que não devem ser commitados.

## Estrutura do monorepo

```
apps/web        Next.js — landing page, autenticação e dashboard
apps/mobile     Expo — app com navegação por abas
packages/types  @vysesystem/types — tipos de domínio compartilhados
```

- **Tipos de domínio** (cliente, produto, venda, usuário...) ficam em `packages/types/src` e são importados de `@vysesystem/types` nos dois apps. Ao criar um tipo novo, exporte-o em `packages/types/src/index.ts`.
- **Dependências** de um app são adicionadas no workspace dele:

  ```bash
  npm install <pacote> --workspace=vysesystem-web
  ```

  ```bash
  npx expo install <pacote>   # dentro de apps/mobile, para manter versões compatíveis com o Expo
  ```

- No app web, siga a organização de `apps/web/src` descrita em [`apps/web/README.md`](./apps/web/README.md): componentes em `_components/<Área>Ui/`, hooks em `_hooks/use-*.ts`, utilitários em `_lib/`.
- **Banco de dados:** o schema fica em `apps/web/prisma/schema.prisma`. Ao alterá-lo, gere a migração com `npm run db:migrate --workspace=vysesystem-web -- --name <descricao>` e commite a pasta `apps/web/prisma/migrations/`. O acesso ao banco fica nas rotas de `app/api` (via `getDb()` de `_lib/db.ts`, sempre filtrando pela empresa ativa com `requireCompanyId()`), as validações em `_lib/schemas.ts`, a conversão dos modelos do Prisma em `_lib/serializers.ts`, as chamadas HTTP do front em `_lib/services` e os hooks do TanStack Query em `_hooks/use-*.ts`.

## Fluxo de trabalho

1. Faça um fork (ou crie um branch, se tiver acesso ao repositório).
2. Crie um branch a partir da `main` com um nome descritivo:
   - `feat/tela-de-vendas`
   - `fix/login-redirect`
   - `docs/contributing`
3. Faça as alterações em commits pequenos e focados.
4. Antes de enviar, rode na raiz:

   ```bash
   npm run check
   ```

   ```bash
   npm run build
   ```

5. Abra o pull request para a `main`.

## Padrões de código

- **TypeScript em tudo**, com `strict` ligado. Evite `any`; prefira `unknown` e estreite o tipo.
- **Indentação de 4 espaços**, sem ponto e vírgula, aspas duplas (o `.editorconfig` cuida do básico).
- **Componentes** em PascalCase (`ModalAddClient.tsx`); **hooks** em kebab-case com prefixo `use-` (`use-clock.ts`).
- **Estilos** com classes do Tailwind; use `cn()` de `@/_lib/utils` para combinar classes condicionais.
- **Formulários** com React Hook Form + Zod.
- **Textos da interface em português** (pt-BR).
- Não deixe imports ou variáveis sem uso — o lint aponta.
- Interfaces responsivas: confira a mudança em telas de celular e de desktop.

## Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/), em português:

```
<tipo>(<escopo opcional>): <descrição no imperativo>
```

| Tipo | Quando usar |
| --- | --- |
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Somente documentação |
| `style` | Formatação, sem mudar comportamento |
| `refactor` | Mudança de código sem nova funcionalidade nem correção |
| `chore` | Configuração, dependências, build, CI |

Exemplos:

```
feat(web): adiciona filtro por data na tela de vendas
fix(mobile): corrige navegação da aba de pedidos
chore: atualiza next para 15.3.4
```

## Pull requests

- Preencha o template: o que muda, por quê e como testar.
- Referencie a issue (`Closes #12`).
- Inclua capturas de tela para mudanças visuais (desktop e mobile).
- Mantenha o PR focado em um assunto; PRs menores são revisados mais rápido.
- O CI roda `lint`, `typecheck` e `build`: o PR só é mesclado com tudo verde.

## Segurança

Não abra issues públicas para vulnerabilidades. Entre em contato diretamente com o mantenedor pelo GitHub ([@caiovisuals](https://github.com/caiovisuals)).

Nunca commite arquivos `.env`, chaves ou dados de usuários.

---

by caiothedev<br/>
#contributing #vysesystem