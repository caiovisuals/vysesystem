# VYSESYSTEM

O VYSESYSTEM é um projeto de **PDV (Ponto de Venda)** criado sem fins lucrativos, com o objetivo principal de aprimorar habilidades técnicas e de design no ecossistema React + Next.js, Prisma, React Native e TanStack Query.

O sistema simula funcionalidades comuns de um PDV, como listagem de produtos e interfaces organizadas, priorizando experiência do usuário, responsividade e organização de código.

## Capturas de Telas

## Dependências

Desenvolvido com as seguintes tecnologias:

- **[Next.js](https://nextjs.org)** – v15.5
- **[React](https://react.dev)** – ^19.0.0  
- **[TypeScript](https://www.typescriptlang.org)** – ^5.x  
- **[Tailwind CSS](https://tailwindcss.com)** – ^4.x
- **[React Hook Form](https://react-hook-form.com)** – ^7.57.x
- **[Zod](https://zod.dev)** - ^4
- **[Prisma ORM](https://www.prisma.io)** – ^7.x + Postgres
- **[TanStack Query](https://tanstack.com/query)** – ^5.x

## Objetivo

Este projeto foi criado sem fins lucrativos, com o intuito de aprimorar minhas habilidades em:

- Registro de usuarios e serviço de login
- Estruturação de interaces com Next.JS
- Construção de telas modernas e responsivas
- Validação de formulário com Zod e React Hook Form
- Animações e transições com React
- Listagem de Produtos
- Escrita de código tipado e consistente com TypeScript

## Configuração

Requisitos: **Node.js 22** (veja `.nvmrc`) e **npm 10+**.

```bash
npm install
```

O app web lê variáveis de `apps/web/.env.local`. Copie `apps/web/.env.example` e defina:

- `AUTH_SECRET`: assina o cookie de sessão (obrigatória em produção; gere com `openssl rand -hex 32`).
- `DATABASE_URL`: URL de um banco Postgres.
- `REDIS_URL` (opcional): Redis para o rate limiting das rotas de API; sem ele, o limite fica na memória do processo.
- `APP_URL`: URL pública do app, usada no link de recuperação de senha (obrigatória em produção; em desenvolvimento usa a origem da requisição).

**Recuperação de senha:** `/forgot-password` gera um link com token de uso único que vale 30 minutos. Ainda não há provedor de e-mail configurado (veja `apps/web/src/_lib/mail.ts`): em desenvolvimento o link aparece no terminal do `npm run dev`; em produção nada é enviado até um provedor ser ligado.

Os dados ficam num Postgres acessado com Prisma. Para desenvolvimento, a forma mais simples é rodar `npx prisma dev --detach` dentro de `apps/web` (sobe um Postgres local e imprime a URL `postgres://...` para usar como `DATABASE_URL`); um Postgres via Docker ou instalado na máquina também funciona. Com a URL configurada, crie as tabelas e os dados de demonstração:

```bash
npm run db:migrate --workspace=vysesystem-web   # aplica as migrações (em produção: db:deploy)
npm run db:seed --workspace=vysesystem-web      # dados de demonstração
```

Depois é só entrar com o usuário `caio` e a senha `12345678`.  Contas novas criadas em `/register` já ganham uma empresa própria (senha com no mínimo 8 caracteres).

> Banco criado antes das migrações estarem no repositório? Marque a inicial como aplicada e depois aplique as novas:
> `npx prisma migrate resolve --applied 20261030000000_init` e `npm run db:deploy` (ambos dentro de `apps/web`).

## Scripts disponíveis

Execute na raiz do repositório:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o app web em modo desenvolvimento |
| `npm run dev:mobile` | Sobe o Expo (app mobile) |
| `npm run build` | Build de produção do app web |
| `npm run start` | Executa o build gerado do app web |
| `npm run lint` | Lint de todos os workspaces |
| `npm run typecheck` | Checagem de tipos de todos os workspaces |
| `npm run test` | Testes unitários (Vitest, sem banco) |
| `npm run test:integration` | Testes de integração das rotas de API contra o Postgres de `DATABASE_URL` |
| `npm run check` | Lint + typecheck + testes unitários |

Os testes de integração apagam todas as tabelas a cada teste, por isso só rodam se o nome do banco terminar em `_test` (ex.: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vysesystem_test`). Aplique as migrações nele antes com `npm run db:deploy --workspace=vysesystem-web`.

Scripts do banco (rode com `--workspace=vysesystem-web`):

| Comando | O que faz |
| --- | --- |
| `npm run db:migrate` | Cria/aplica migrações a partir de `prisma/schema.prisma` (desenvolvimento) |
| `npm run db:deploy` | Aplica as migrações existentes (produção) |
| `npm run db:seed` | Popula o banco com os dados de demonstração |
| `npm run db:reset` | Apaga o banco, reaplica as migrações e roda o seed |
| `npm run db:generate` | Gera o Prisma Client (já roda no `npm install` e no `build`) |
| `npm run db:studio` | Abre o Prisma Studio |

by caiothedev<br/>
#vysesystem #pdv #nextjs #react #zod #ts