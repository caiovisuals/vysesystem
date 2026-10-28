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
- **[Drizzle ORM](https://orm.drizzle.team)** + Postgres / [PGlite](https://pglite.dev)
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

O app web lê variáveis de `apps/web/.env.local`. Copie `apps/web/.env.example` e defina `AUTH_SECRET` (obrigatória em produção; gere com `openssl rand -hex 32`).

Os dados ficam num banco Postgres acessado com Drizzle ORM. Em desenvolvimento não é preciso instalar nada: sem `DATABASE_URL`, o app usa um Postgres embutido (PGlite) em `apps/web/data/` (ignorado pelo git), já populado com dados de demonstração (usuário `caio`, senha `123456`). Detalhes em [`apps/web/README.md`](./apps/web/README.md).

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

## Contribuindo

Leia o [CONTRIBUTING.md](./CONTRIBUTING.md).

by caiothedev<br/>
#vysesystem #pdv #nextjs #react #zod #ts