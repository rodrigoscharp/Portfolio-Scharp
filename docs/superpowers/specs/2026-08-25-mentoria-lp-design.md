# Landing page de venda da mentoria — design

Data: 2026-08-25
Status: aprovado para planejamento

## Objetivo

Criar uma landing page de venda da mentoria do Rodrigo dentro do repositório do
portfólio. A página vive no mesmo site estático, é alcançável pelo menu, mas tem
identidade visual própria e independente do portfólio.

O tema da mentoria (nicho, promessa, preço, formato) ainda não está definido.
A página é entregue com a estrutura completa e todo o texto em placeholders
marcados, prontos para substituição.

## Decisões tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Idioma | Português (BR) | Público-alvo da mentoria é brasileiro, mesmo o resto do site sendo em inglês |
| CTA principal | WhatsApp (`wa.me` com mensagem pré-preenchida) | Menor atrito; permite qualificar o lead na conversa |
| Navegação | Link "Mentoria" no menu e footer das páginas existentes | Descoberta pelo site sem quebrar a navegação |
| Design | Isolado do portfólio, CSS e JS próprios | Liberdade de identidade sem risco de regressão no portfólio |
| Estrutura | Oferta completa com preço na página | Superset: remover o bloco de preço depois é barato; adicionar é caro |

## Arquitetura

Site estático, sem build. Três arquivos novos e uma edição pontual nas páginas
existentes.

```
mentoria.html               página completa
assets/css/mentoria.css     reset + tokens + componentes (NÃO importa lando-system.css)
assets/js/mentoria.js       Lenis, reveals GSAP, accordion, CTA sticky
```

Edição nas 5 páginas existentes (`index`, `dev`, `founder`, `network`,
`services`): acrescentar `<a href="mentoria.html">Mentoria</a>` ao `nav` do
`#menu-overlay` e à coluna "Pages" do `.site-footer__cols`. Nenhuma outra
alteração nelas.

### Isolamento

`mentoria.html` não carrega `lando-system.css` nem `motion.js`. Carrega GSAP,
ScrollTrigger e Lenis pelo mesmo CDN já usado no site, mais os seus próprios CSS
e JS. Consequência: nenhuma regra escrita para a LP pode afetar o portfólio, e
mudanças futuras no `lando-system.css` não afetam a LP.

O `mentoria.css` traz o seu próprio reset (`box-sizing`, margens zeradas, `img`
block) porque não herda o do lando-system.

## Identidade visual

Deliberadamente oposta ao portfólio (claro, esportivo, textura topográfica,
Anton).

### Tokens

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0F0E0C` | Fundo base, preto quente |
| `--fg` | `#F4F1EA` | Texto sobre fundo escuro |
| `--surface` | `#F4F1EA` | Faixas claras (oferta, FAQ) |
| `--surface-fg` | `#16150F` | Texto sobre faixa clara |
| `--accent` | `#E8A33D` | Âmbar: CTAs, destaques, números |
| `--accent-ink` | `#16150F` | Texto sobre âmbar |
| `--sage` | `#7C8B6F` | Secundária: checks da transformação |
| `--muted` | `rgba(244,241,234,.62)` | Texto de apoio no escuro |
| `--line` | `rgba(244,241,234,.14)` | Bordas e divisores |

Contraste: `--accent` sobre `--bg` e `--accent-ink` sobre `--accent` devem passar
AA (4.5:1) para texto. Verificar antes de fechar.

### Tipografia

- Display: **Instrument Serif** — serifa de alto contraste, comunica autoridade
  editorial em vez de "infoproduto".
- Corpo: **Inter** — 400/500/600.
- Nenhuma das fontes do portfólio (Anton, Archivo, Caveat, Fraunces) aparece aqui.
- Carregadas via Google Fonts com `preconnect`, seguindo o padrão das outras páginas.

### Textura

Grão sutil sobre o fundo (SVG `feTurbulence` inline em `background-image`, baixa
opacidade) e um halo radial âmbar atrás do hero. Sem padrão topográfico.

Seções alternam fundo escuro e faixa clara. Blocos de oferta e FAQ vão em faixa
clara para criar respiro e destacar a decisão de compra.

## Estrutura da página

Ordem fixa. Cada seção tem um id âncora.

| # | id | Seção | Conteúdo |
|---|---|---|---|
| 1 | `hero` | Hero | Label da mentoria, headline de promessa, subheadline (pra quem + prazo), CTA WhatsApp, 3 micro-provas |
| 2 | `prova` | Prova social | Faixa em marquee lento com logos ou números |
| 3 | `dores` | É pra você se… | 4 cards de dor em primeira pessoa |
| 4 | `transformacao` | A transformação | Duas colunas: hoje (✗) / depois (✓) |
| 5 | `sobre` | Quem sou eu | Foto, bio, credenciais, link discreto para o portfólio |
| 6 | `funciona` | Como funciona | Timeline vertical numerada: formato, frequência, duração, canal |
| 7 | `pilares` | O que você vai dominar | Grid de 4 a 6 pilares |
| 8 | `incluso` | O que está incluso | Checklist com valor percebido por item, mais bônus |
| 9 | `depoimentos` | Depoimentos | 3 cards (foto, nome, resultado) |
| 10 | `oferta` | Oferta | Card central: entregáveis, preço, parcelamento, CTA, garantia, vagas |
| 11 | `faq` | FAQ | Accordion com 6 a 8 objeções |
| 12 | `cta-final` | CTA final | Bloco cheio, headline curta, botão, linha de escassez |
| 13 | — | Footer | Nome, WhatsApp, e-mail, ©. Sem menu do portfólio |

### Seção 9 (depoimentos)

Entregue com marcação completa, mas com `hidden` no elemento `<section>` e um
comentário HTML explicando como ligar. Motivo: depoimento inventado é o item de
maior risco numa página de venda. A seção só entra no ar quando houver
depoimentos reais.

### CTA sticky (mobile)

Barra fixa no rodapé da viewport, só em telas `< 900px`, com o botão de WhatsApp.
Aparece quando o hero sai da tela e some quando a seção `#oferta` entra (para não
competir com o CTA principal). Implementada com ScrollTrigger.

## Conteúdo e placeholders

Todo texto de venda entra como placeholder em caixa alta entre colchetes:
`[PROMESSA PRINCIPAL]`, `[SUBHEADLINE]`, `[DOR 1]`, `[PILAR 1 — TÍTULO]`,
`[R$ X.XXX]`, `[NUMERO_WHATSAPP]`. Assim o Rodrigo localiza tudo com uma busca
por `[` e nada falso vai ao ar por engano.

O corpo de cada card recebe uma frase-exemplo curta em cinza comentada no HTML,
mostrando o tipo de texto esperado ali — orientação sem virar conteúdo publicado.

## CTA e rastreamento

Todos os CTAs apontam para o mesmo destino:

```
https://wa.me/[NUMERO_WHATSAPP]?text=Oi%20Rodrigo!%20Quero%20saber%20mais%20sobre%20a%20mentoria.
```

Cada botão carrega um atributo `data-cta` com a origem (`hero`, `oferta`,
`final`, `sticky`). Nenhuma ferramenta de analytics é instalada agora; o atributo
existe para que, quando houver, a origem já esteja marcada no HTML.

## Motion

- Lenis para scroll suave, GSAP + ScrollTrigger para os reveals, mesmas versões
  de CDN já usadas no site.
- **Todo reveal usa `gsap.fromTo`, nunca `gsap.from`.** `from()` recaptura o
  estado final no `ScrollTrigger.refresh()` e congela os elementos deslocados.
- `prefers-reduced-motion: reduce` desliga reveals e marquee (o grão é estático, permanece);
  o conteúdo aparece no estado final.
- Sem loader de cortina: numa LP de venda, atrasar o conteúdo custa conversão.

## Responsivo e acessibilidade

- Mobile-first. Breakpoints em 640px, 900px e 1200px.
- Grids caem para uma coluna abaixo de 640px; a comparação da seção 4 vira dois
  blocos empilhados.
- FAQ usa `<details>`/`<summary>` nativos, estilizados — teclado e leitor de tela
  funcionam sem JS.
- Foco visível em todos os elementos interativos.
- Contraste AA verificado nos pares âmbar/escuro e escuro/claro.
- Uma única `<h1>` (o hero); demais seções em `<h2>`.
- Links de WhatsApp com `target="_blank"` e `rel="noopener noreferrer"`.

## Verificação

`scripts/verify-shot.cjs` em 390px e 1440px, seção a seção, exigindo console
limpo. Checagem manual do accordion, do CTA sticky e dos links de WhatsApp.
Confirmar que as 5 páginas do portfólio continuam idênticas exceto pelo novo item
de menu.

## Fora de escopo

- Definição do tema, promessa, preço e formato da mentoria (vem depois).
- Formulário de captura, checkout, pixel de anúncio, analytics.
- Depoimentos reais e fotos de mentorados.
- Tradução da LP para inglês.
