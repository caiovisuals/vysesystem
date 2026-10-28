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
- **[Zod](https://zod.dev)** - ^3.24.2

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

O app web fica em `apps/web`. Copie `apps/web/.env.example` para `apps/web/.env.local` e defina `AUTH_SECRET` (obrigatória em produção; gere com `openssl rand -hex 32`).
Os usuários cadastrados são salvos localmente em `apps/web/data/users.json` (ignorado pelo git).

## Scripts disponíveis

Execute dentro de `apps/web`:

```
### Ambiente de desenvolvimento
npm run dev
### Build de produção
npm run build
### Executar build gerado
npm run start
### Lint do projeto
npm run lint
```

by caiothedev<br/>
#vysesystem #pdv #nextjs #react #zod #ts