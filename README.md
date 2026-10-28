# VYSESYSTEM

O VYSESYSTEM é um projeto de **PDV (Ponto de Venda)** criado sem fins lucrativos, com o objetivo principal de aprimorar habilidades técnicas e de design no ecossistema React + Next.js.<br/>
O sistema simula funcionalidades comuns de um PDV, como listagem de produtos e interfaces organizadas, priorizando experiência do usuário, responsividade e organização de código.

## Capturas de Telas

## Dependências

Desenvolvido com as seguintes tecnologias:

- **[Next.js](https://nextjs.org)** – v15.3.3  
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

Os dados ficam num Postgres acessado com Prisma. Para desenvolvimento, a forma mais simples é rodar `npx prisma dev --detach` dentro de `apps/web` (sobe um Postgres local e imprime a URL `postgres://...` para usar como `DATABASE_URL`); um Postgres via Docker ou instalado na máquina também funciona. Com a URL configurada, crie as tabelas e os dados de demonstração:

```bash
npm run db:migrate --workspace=vysesystem-web   # aplica as migrações
npm run db:seed --workspace=vysesystem-web      # dados de demonstração
```

Depois é só entrar com o usuário `caio` e a senha `123456`.

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
| `npm run check` | Lint + typecheck |

Scripts do banco (rode com `--workspace=vysesystem-web`):

| Comando | O que faz |
| --- | --- |
| `npm run db:migrate` | Cria/aplica migrações a partir de `prisma/schema.prisma` (desenvolvimento) |
| `npm run db:deploy` | Aplica as migrações existentes (produção) |
| `npm run db:seed` | Popula o banco com os dados de demonstração |
| `npm run db:reset` | Apaga o banco, reaplica as migrações e roda o seed |
| `npm run db:generate` | Gera o Prisma Client (já roda no `npm install` e no `build`) |
| `npm run db:studio` | Abre o Prisma Studio |

## Contribuindo

Leia o [CONTRIBUTING.md](./CONTRIBUTING.md).

by caiothedev<br/>
#vysesystem #pdv #nextjs #react #zod #ts