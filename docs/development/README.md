# DOCUMENTAÇÃO DO DESENVOLVIMENTO

## Plataformas

| App | Pasta | Tecnologia | Como fala com os dados |
| --- | --- | --- | --- |
| Web | `apps/web` | Next.js | Dono da API (`/api/*`) e do banco (Prisma + Postgres) |
| Desktop | `apps/desktop` | Electron + React + Vite | Cliente da API do web, pelo processo principal do Electron |
| Mobile | `apps/mobile` | Expo / React Native | Telas ainda sem integração com a API |

## Pacotes compartilhados

- `@vysesystem/types` (`packages/types`): tipos de domínio (produto, venda, cliente...).
- `@vysesystem/schemas` (`packages/schemas`): schemas Zod. O web valida o corpo das rotas com eles, e os formulários (web e desktop) podem reaproveitá-los.
- `@vysesystem/api-client` (`packages/api-client`): uma função por rota da API (`getProducts`, `createSale`...). Quem envia a requisição é um *transporte* trocável com `setTransport`: o web usa `fetch` na mesma origem, e o desktop usa a ponte `window.vyse.api.request`.

## Desktop

O app desktop é um caixa: login e tela de venda com busca por código ou nome (compatível com leitor de código de barras). A arquitetura, a segurança e como gerar o instalador estão em [`apps/desktop/README.md`](../../apps/desktop/README.md).

by caiothedev<br/>
#documentation #code