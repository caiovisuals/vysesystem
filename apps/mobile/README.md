# VYSESYSTEM - MOBILE

App mobile do VYSESYSTEM, feito com Expo e Expo Router.

## Rodando

Na raiz do monorepo:

```bash
npm install
npm run dev:mobile
```

Depois abra no Expo Go (QR code), no emulador Android (`a`) ou no simulador iOS (`i`).

## Organização

- `src/app/_layout.tsx` — layout raiz (Stack)
- `src/app/(tabs)/` — telas com navegação por abas: dashboard, vendas, pedidos, fiscal e configurações
- `assets/images/` — ícone e splash

Os tipos de domínio vêm de `@vysesystem/types`, os mesmos usados no app web.

by caiothedev<br/>
#mobile