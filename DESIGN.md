# DESIGN

Este documento descreve a linguagem visual do VyseSystem tal como ela existe hoje no código. Ele serve de referência para quem vai criar telas novas (pessoas ou agentes de IA) nos três apps do monorepo:

| App | Stack | Onde estão os estilos |
| --- | --- | --- |
| Web | Next.js + Tailwind CSS v4 | `apps/web/src/app/globals.css` |
| Desktop (caixa) | Electron + Vite + Tailwind CSS v4 | `apps/desktop/src/renderer/src/styles.css` |
| Mobile | Expo / React Native | ainda sem tema próprio (usa o padrão do `expo-router`) |

> **Fonte da verdade:** os tokens de cor ficam em `globals.css` (web). O desktop copia a mesma paleta. Ao mudar um token, atualize os dois arquivos e este documento.

## 1. Princípios

1. **Escuro e calmo.** A interface é inteiramente dark: fundos quase pretos, superfícies em cinzas próximos e texto branco. Não existe tema claro hoje (a tela "Aparência" em Configurações ainda é só um placeholder).
2. **Um acento só.** O lilás `--text-head` (`#D6B6FF`) é a única cor de marca. Ele aparece com moderação: links de ação, valores em destaque, ícones de feature e o spinner de carregamento. Nunca use o lilás em grandes áreas de fundo.
3. **Hierarquia por luminosidade, não por cor.** Estados (hover, ativo, foco) são indicados subindo um degrau na escala de cinzas: `foreground` → `middleground`.
4. **Cantos arredondados e generosos.** Controles usam `15px`, botões de marketing são pílulas (`rounded-full`).
5. **Feito para o balcão.** Fontes grandes (`18px` na navegação), alvos de clique confortáveis e fluxos curtos: o usuário é um comerciante operando o caixa.
6. **Tudo em português (pt-BR)** e com tom direto e próximo ("Eae empresário? Tá interessado né?" na landing; tom mais neutro dentro da plataforma).

## 2. Cores

### 2.1 Tokens

Definidos como variáveis CSS em `:root` e expostos ao Tailwind via `@theme inline`, então podem ser usados de duas formas: `bg-[var(--foreground)]` (forma predominante no web) ou `bg-foreground` (forma usada no desktop).

| Token | Valor | Papel |
| --- | --- | --- |
| `--background` | `#131313` | Fundo da página, fundo de modais e trilho da scrollbar |
| `--second-background` | `#232323` | Superfícies elevadas: cards de feature, painel lateral do caixa, hover de linhas (desktop) |
| `--third-background` | `#211C1F` | Superfície alternativa levemente arroxeada (pouco usada; só web) |
| `--foreground` | `#353535` | **Superfície de controle**: botões padrão, cards de estatística, bordas de inputs/tabelas, divisores, hover da sidebar |
| `--middleground` | `#424242` | **Estado elevado**: hover de botões, foco de inputs, item ativo da sidebar, filtro selecionado, polegar da scrollbar |
| `--image-background` | `#2B232B` | Placeholder atrás de imagens/avatares |
| `--text` | `white` | Texto principal |
| `--text-head` | `#D6B6FF` | Acento de marca (lilás) |
| `--sub-text` | `#AAA` | Texto secundário: legendas, descrições, labels, placeholders, estados vazios, itens desabilitados |

### 2.2 Fundo da página

O `body` não é chapado: recebe um gradiente vertical sutil que puxa para o roxo no fim da página.

```css
body { background: linear-gradient(var(--background), #191219); }
```

Overlays da landing usam a variante `linear-gradient(var(--background), #110D11)` (`.lp-overlay-colorbase`).

### 2.3 Cores semânticas

Não há tokens próprios; usam-se as cores do Tailwind diretamente:

| Uso | Classe |
| --- | --- |
| Mensagem de erro em formulário, ícone de remover | `text-red-400` |
| Erro de carregamento / alerta de tela | `text-red-500` |
| Status positivo (ex.: venda concluída) | `text-green-500` / `bg-green-500` |
| Status de atenção (ex.: pendente) | `text-yellow-500` |

### 2.4 Cores fora da paleta (a evitar)

Alguns componentes da landing usam hex soltos: `#3a3a3a` / `#444` (botão hambúrguer), `#171717` / `#292929` (dropdown "Empresa"), `#101010` (drawer mobile). Em código novo, prefira os tokens; se um desses tons for necessário de verdade, promova-o a token.

## 3. Tipografia

- **Família:** [Geologica](https://fonts.google.com/specimen/Geologica), aplicada a todos os elementos (`* { font-family: var(--font-geologica) }`).
  - Web: carregada com `next/font/google` (variável `--font-geologica`).
  - Desktop: `@fontsource-variable/geologica` (definida como `--font-sans`).
- **Títulos** (`h1`–`h6`) têm `line-height: 100%`, o que deixa os títulos grandes compactos.
- **`th`** usa peso normal: cabeçalhos de tabela não ficam em negrito.
- Os pesos usados são `normal`, `font-medium` (500) e `font-semibold` (600). Negrito pesado (700) aparece só na página 404.

### Escala

| Papel | Tamanho | Responsivo | Exemplo |
| --- | --- | --- | --- |
| Display (hero) | `68px` | `46px` ≤768, `32px` ≤640 | "Controle fácil, Cresça rápido." |
| Título de seção (marketing) | `48px` | `40px` ≤1024, `32px` ≤768 | "Feito para o dia a dia de quem vende." |
| Número de destaque | `40px` | `30px` ≤768 | Estatísticas da landing, em `--text-head` |
| Título de página/tela (app) | `34px`, `font-medium` | — | "Logar", "Aparência" |
| Título de modal | `text-2xl` (24px), `font-semibold` | — | "Adicionar Cliente" |
| Valor de KPI | `text-2xl`, `font-semibold` | — | `StatCard` |
| Título de card | `22px` | — | `FeatureCard` |
| Corpo grande / navegação | `18px` | `16px` ≤1024 | Itens da sidebar, subtítulos |
| Corpo | `16px` | — | Texto padrão |
| Legenda / label | `14px` ou `text-sm` | — | Labels de formulário, título do `StatCard` |
| Erro de campo | `13px` | — | `FormField` |

Padrão de cabeçalho: **título em `--text` + descrição logo abaixo em `--sub-text`, `18px`**.

## 4. Forma, espaçamento e elevação

### Raios

| Elemento | Raio |
| --- | --- |
| Inputs, selects, botões do app, cards de KPI, itens da sidebar, filtros | `rounded-[15px]` (padrão do sistema) |
| Botões e links de marketing, badges, avatares, botões de ícone, steppers | `rounded-full` |
| Cards de feature (landing / "Por que usar?") | `rounded-[24px]` |
| Modais, dropdowns | `rounded-2xl` (16px) |
| Drawer do menu mobile | `rounded-l-[30px]` |

### Bordas

- Espessura padrão: **`border-2`**, cor `--foreground`; no hover/foco sobe para `--middleground`.
- Tabelas separam linhas com `border-t-2 border-[var(--foreground)]`.
- Divisores: barra de `2px` (`h-0.5` / `w-0.5`) em `--middleground`.

### Espaçamento

- Conteúdo do dashboard: `p-[18px]` com `gap-[15px]` entre blocos.
- Sidebar: largura fixa de `350px`, `p-[10px]`, itens com `gap-[8px]`.
- Landing: padding horizontal progressivo `px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-64` e seções com `py-24` (`py-16` ≤768).
- Grade de cards: `gap-4` (app) / `gap-6` (marketing).

### Elevação

O sistema é praticamente plano; profundidade vem da cor da superfície. Sombras só em camadas flutuantes:

- `.lp-overlay-shadow` → `box-shadow: 0 0 45px rgba(0,0,0,.25)`
- Dropdowns → `shadow-xl`
- Overlays de modal/menu → `rgba(0,0,0,.5)` (`.modal-overlay`, `.nav-mobile-overlay`)

### Camadas (z-index)

| Camada | z-index |
| --- | --- |
| Overlay da landing | 50 |
| Header da landing | 100 (dropdown 110) |
| Drawer mobile | 200–201 |
| Modal | 500 |

## 5. Movimento

Duas utilidades globais, sempre `ease-in-out` e animando `all`:

| Classe | Duração | Quando usar |
| --- | --- | --- |
| `.transition-fast` | 150ms | Controles e formulários: inputs, botões de modal, paginação, steppers, abertura de modal |
| `.transition-normal` | 300ms | Navegação e layout: sidebar, links, accordion, drawer, cards de feature |

Padrões recorrentes:

- **Modal:** overlay faz fade (`opacity-0` → `opacity-100`) e o painel cresce de `scale-95` para `scale-100`. Fechado, usa `pointer-events-none` (o modal continua montado).
- **Submenu da sidebar:** `max-h-0 opacity-0` → `max-h-[500px] opacity-100`.
- **Drawer mobile:** `translate-x-full` → `translate-x-0`.
- **Accordion (FAQ):** ícone "+" gira 45° (`group-open:rotate-45`); chevron do dropdown gira 90°.
- **Logo e ícones do header:** `hover:brightness-75`.
- **Carregamento:** spinner circular `border-4` em `--middleground` com o topo em `--text-head` (`animate-spin`).
- `html { scroll-behavior: smooth; }`

## 6. Iconografia e imagens

- Ícones são **SVG inline no estilo Lucide**: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap/Join="round"`. Não há biblioteca de ícones instalada: copie o path e use `currentColor` para herdar a cor do texto.
- Tamanhos: `24–25px` na sidebar e no header, `18–22px` dentro de botões e linhas de tabela.
- Ícone de destaque: dentro de um círculo `size-12 rounded-full bg-[var(--foreground)]` com o traço em `--text-head`.
- Logo: `/logo.png`, altura `25px`.
- Avatares: circulares, `25px`, borda de `2px` na cor do fundo e sobrepostos com `-ml-2`.

## 7. Componentes

As receitas abaixo são as classes reais usadas no código. Reaproveite-as (ou o componente correspondente) em vez de inventar variações.

### 7.1 Botões

| Variante | Classes | Onde |
| --- | --- | --- |
| **Primário (app)** | `bg-[var(--foreground)] hover:bg-[var(--middleground)] px-4 py-2 rounded-[15px] transition-fast cursor-pointer` | Salvar, Entrar, paginação |
| **Fantasma (app)** | `bg-transparent hover:bg-[var(--foreground)] px-4 py-2 rounded-[15px] transition-fast` | Cancelar |
| **Primário (marketing)** | `bg-[var(--foreground)] hover:bg-[var(--middleground)] py-2 px-6 rounded-full transition-normal` | "Registre suas vendas", "Cadastre-se" |
| **Contorno (marketing)** | `border-2 border-[var(--foreground)] hover:bg-[var(--foreground)] py-2 px-6 rounded-full transition-normal` | "Ver documentação" |
| **Link de texto** | `py-1 px-4 rounded-full hover:text-[var(--sub-text)] transition-normal` | Navegação do header |
| **Ícone redondo** | `size-7 rounded-full bg-[var(--foreground)] hover:bg-[var(--middleground)]` | Steppers +/− do carrinho |
| **Ícone destrutivo** | `p-1 rounded-full hover:bg-[var(--foreground)]` com ícone `text-red-400` | Remover item |

- **Desabilitado:** o texto vira `--sub-text` e o cursor volta ao padrão (`disabled:text-[var(--sub-text)] disabled:cursor-default enabled:cursor-pointer`).
- **Carregando:** troque o rótulo ("Salvar" → "Salvando") e desabilite o botão.
- Ações ficam alinhadas à direita em modais (`flex justify-end gap-3`), com o botão fantasma antes do primário.

### 7.2 Campos de formulário

Use `fieldClass` e o wrapper `FormField` de `apps/web/src/_components/Modals/FormField.tsx`:

```ts
export const fieldClass =
  "w-full px-3 py-2 border-2 border-[var(--foreground)] focus:border-[var(--middleground)] rounded-[15px] outline-none bg-transparent transition-fast"
```

- Label acima do campo em `14px` / `--sub-text`; erro abaixo em `13px` / `text-red-400` com `role="alert"`.
- Inputs são **transparentes com borda**, nunca preenchidos.
- `<option>` recebe `bg-[var(--background)]` para não herdar o fundo branco do sistema.
- **Busca:** ícone à esquerda (`absolute left-3`, `18px`), `pl-[35px]`, e a borda reage ao **hover** (`hover:border-[var(--middleground)]`).
- Senha: botão de mostrar/ocultar posicionado à direita dentro do campo.

### 7.3 Cards

| Card | Receita |
| --- | --- |
| **KPI (`StatCard`)** | `bg-[var(--foreground)] p-4 rounded-[15px]`; título `text-sm` em `--sub-text`, valor `text-2xl font-semibold` (em `--text-head` quando `highlight`), descrição `text-sm` em `--sub-text` |
| **Painel com contorno** | `p-4 border-2 border-[var(--foreground)] rounded-[15px]` com título `18px font-medium` (ex.: "Formas de pagamento") |
| **Feature (marketing)** | `p-6 bg-[var(--second-background)] border-2 border-[var(--foreground)] hover:border-[var(--middleground)] rounded-[24px]`; ícone em círculo, título `22px`, descrição em `--sub-text` |

### 7.4 Navegação

**Sidebar do dashboard** (`_components/Sidebar.tsx`, `SidebarUi/Nav.tsx`)
- Item: `flex items-center gap-[12px] px-[15px] py-[8px] rounded-[15px]`, ícone 24px + texto `18px font-medium`.
- Ativo: `bg-[var(--middleground)]`. Hover: `bg-[var(--foreground)]`.
- Subitens (ex.: Cadastro → Produtos, Clientes, Fornecedores, Colaboradores) ficam recuados `ml-[30px]`; inativos em `--sub-text`, ativos com `bg-[var(--foreground)]`. O grupo abre sozinho quando a rota atual está dentro dele.

**Header do dashboard:** logo à esquerda; à direita, ícones de Ajuda, Página inicial e Sair (25px, `hover:brightness-75`).

**Header da landing:** logo + links de texto + divisor vertical + "Login" + botão "Cadastre-se". Abaixo de `1152px` vira botão hambúrguer que abre um drawer pela direita.

**Filtros segmentados** (ex.: período em Vendas): botões `px-[15px] py-[5px] border-2 rounded-[15px]`; selecionado `bg-[var(--middleground)] border-[var(--middleground)]`, demais `border-[var(--foreground)] hover:border-[var(--middleground)]`.

### 7.5 Tabelas

- `w-full` dentro de um wrapper `relative w-full overflow-x-auto`.
- Células `p-2`; linhas separadas por `border-t-2 border-[var(--foreground)]`; cabeçalho sem negrito.
- Números e valores monetários alinhados à direita com `whitespace-nowrap`; índices e códigos em `--sub-text`.
- **Estado vazio:** uma linha com `colSpan` total, centralizada, `py-8`, texto em `--sub-text` que explica o próximo passo ("Nenhum item no pedido. Busque um produto pelo código ou nome para começar.").
- **Paginação** (`RegisterUi/PaginationBar.tsx`): resumo à esquerda; "Página X de Y" (com `aria-live="polite"`) + botões "Anterior"/"Próxima" à direita.

### 7.6 Modais

```
overlay: fixed modal-overlay flex items-center justify-center transition-fast
painel:  bg-[var(--background)] p-6 rounded-2xl space-y-3 w-full max-w-md transition-fast
```

- Clique no overlay fecha; o painel usa `stopPropagation`.
- Título `text-2xl font-semibold`, campos empilhados, ações à direita.
- Em caso de erro ao salvar, o modal permanece aberto para nova tentativa.

### 7.7 Outros padrões

- **Badge de prova social** (`Affirmation`): pílula `border-2 border-[var(--middleground)] rounded-full py-2 px-3`, avatares sobrepostos + texto `15px`.
- **FAQ** (`<details>` nativo): `border-b-2 border-[var(--foreground)] py-5`, pergunta `18px`, resposta em `--sub-text`.
- **Faixa de estatísticas:** grade com `border-y-2 border-[var(--foreground)]`, número em `--text-head` e legenda em `--sub-text`.
- **Toasts:** `react-hot-toast` (`<Toaster />` nos layouts de auth e dashboard), com mensagens curtas em português: `toast.success("Senha alterada! ...")`, `toast.error("Produto não encontrado")`.
- **Links inline de ação** (ex.: "Criar Conta", "Trocar Senha"): `text-[var(--text-head)]`.
- **Scrollbar:** 15px no web (12px no desktop), trilho `--background`, polegar `--middleground` (hover `--foreground`).

## 8. Layouts

| Contexto | Estrutura |
| --- | --- |
| **Landing e páginas institucionais** (`/`, `/why`, `/redefine`, `/careers`...) | Header → seções empilhadas com `sectionPadding` → Footer. Hero em duas colunas (texto + mockups de desktop/mobile) que vira coluna única ≤1440px |
| **Autenticação** (`/login`, `/register`, `/forgot-password`, `/reset-password`) | Header + `main` centralizado (formulário com `min-w-[500px]`, `gap-6`) + Footer |
| **Dashboard** (`/dashboard/*`) | `flex-row w-screen h-screen`: sidebar fixa de 350px + coluna com header e conteúdo (`p-[18px]`) |
| **PDV desktop** | Header com nome da empresa (em `--text-head`) e operador; corpo em grade `1fr / 400px` com lista de produtos à esquerda e "Venda atual" (painel `bg-second-background`) à direita, total em `text-2xl` lilás |
| **Estados globais** | `loading.tsx` (spinner centralizado), `not-found.tsx` ("Erro 404", `50px`), `error.tsx` |

### Breakpoints

O projeto mistura breakpoints do Tailwind (`sm`, `md`, `lg`, `xl`, `2xl`) com **max-widths arbitrários**, que são o padrão dominante nas páginas de marketing:

`max-[480px]` · `max-[512px]` · `max-[640px]` · `max-[768px]` · `max-[1024px]` · `max-[1152px]` · `max-[1280px]` · `max-[1440px]`

Pense de forma *desktop-first* nas páginas de marketing (o layout base é o desktop e os `max-[...]` reduzem) e *mobile-first* nas telas do dashboard (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`).

## 9. Acessibilidade

O que já é praticado e deve ser mantido:

- `aria-label` em botões que só têm ícone ("Diminuir quantidade de X", "Abrir menu").
- `title` nos ícones do header ("Ajuda", "Sair").
- `role="alert"` em mensagens de erro e `aria-live="polite"` em contadores que mudam.
- `sr-only` para cabeçalhos de coluna sem texto visível.
- `aria-expanded` / `aria-haspopup` em menus.

Atenção:

- `--sub-text` (`#AAA`) passa no contraste AA para texto normal sobre `--background` (~8:1) e `--foreground` (~5.3:1), mas fica abaixo de 4.5:1 sobre `--middleground` (~4.3:1). Evite texto pequeno em `--sub-text` dentro de itens ativos/hover em `--middleground` (é por isso que botões desabilitados nesse fundo ficam no limite).
- Vários inputs usam `outline-none`; sempre substitua por uma mudança visível (`focus:border-[var(--middleground)]`), como em `fieldClass`.
- Prefira `<button>` a `<div>`/`<a>` clicáveis (o botão hambúrguer da landing ainda é uma `div`).

## 10. Divergências conhecidas

Coisas que o código atual faz de forma inconsistente e que valem alinhar quando a tela for mexida:

1. **Desktop vs. web:** o app desktop usa `border` (1px) e `rounded-lg`/`rounded-xl`, enquanto o web usa `border-2` e `rounded-[15px]`. O padrão de referência é o do web.
2. **Classe `.lp-cta`** é usada na seção final da landing (`app/page.tsx`), mas não está definida em `globals.css`.
3. **`ModalAddClient`** repete as classes do input sem o estado de foco; deveria usar `fieldClass`/`FormField`.
4. **`error.tsx`** usa um botão preenchido em lilás (`bg-[var(--text-head)]`, `rounded-lg`), único caso do acento como fundo de botão.
5. **Tabela de clientes** usa `text-muted-foreground`, classe que não existe na paleta (deveria ser `text-[var(--sub-text)]`).
6. **Mobile (Expo)** ainda não aplica a paleta nem a fonte Geologica.
7. Hex soltos na landing (seção 2.4).

by caiothedev<br/>
#design #layouts #guide