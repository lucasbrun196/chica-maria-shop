# Chica Maria

Protótipo de front-end da loja de moda feminina Chica Maria, de Passo Fundo (RS).
Não há back-end: contas, sacola, favoritos e pedidos ficam salvos no `localStorage` do navegador.

## Como rodar

Requer Node 20 ou superior.

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

Versão de produção (site estático, pronto para Netlify, Vercel, GitHub Pages etc.):

```bash
npm run build
npm run preview
```

Os arquivos finais ficam em `build/`.

## Hospedagem na Vercel

A configuração está em `vercel.json` (build estático, URLs sem `.html`, cache longo para os assets).

Pelo site: suba o projeto para um repositório no GitHub, entre em vercel.com, clique em **Add New → Project**,
importe o repositório e clique em **Deploy**. Não precisa alterar nenhuma opção.

Pela linha de comando:

```bash
npx vercel
```

E para publicar em produção:

```bash
npx vercel --prod
```

## Stack

- **SvelteKit 2 + Svelte 5** com TypeScript. O Svelte compila os componentes para JavaScript puro, sem virtual DOM,
  o que deixa o bundle pequeno (cerca de 115 kB gzip somando todas as páginas) e o uso de memória baixo.
- **adapter-static**: todas as páginas, incluindo os 29 produtos, são pré-renderizadas em HTML.
- CSS próprio, sem framework. Fontes servidas localmente (EB Garamond e Jost), com preload.

## O que tem no protótipo

- Home com abertura animada, parallax, faixa rolante, categorias, carrossel de novidades, editorial e um lookbook
  horizontal que acompanha o scroll.
- Loja com categorias, coleções, busca, filtros (tamanho, cor, preço, promoção), ordenação e "carregar mais".
- Página de produto com galeria, zoom no hover, cores, tamanhos (esgotados com "avise-me"), guia de medidas,
  cálculo de frete por CEP e sugestões de look.
- Sacola lateral e página de sacola, com cupom e barra de frete grátis.
- Cadastro completo (nome, CPF validado, nascimento, celular, endereço com busca automática pelo CEP e senha).
- Navegação livre sem login. Para finalizar a compra é preciso entrar ou criar conta.
- Checkout em três etapas: entrega (retirada na loja, motoboy em Passo Fundo, PAC, SEDEX), pagamento (Pix com 5% de
  desconto, cartão em até 6x, boleto) e revisão.
- Confirmação do pedido com QR Code Pix simulado, contagem regressiva, boleto e acompanhamento.
- Minha conta: pedidos, dados pessoais, endereço e troca de senha. Favoritos, Sobre, Ajuda, Coleção e página 404.

Cupons para testar: `BEMVINDA10` (10%) e `CHICA15` (15%).

## Simulações

- Pagamentos são fictícios. Nenhum dado de cartão sai do navegador.
- A busca de endereço pelo CEP usa a API pública do ViaCEP. Se ela falhar, o usuário preenche à mão.
- As senhas são guardadas com hash no `localStorage`, apenas para a demonstração.
- Para zerar tudo, limpe os dados do site no navegador.

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Produtos, categorias, looks, tabela de medidas | `src/lib/data/products.ts` |
| Endereço, telefone, horários, cupons, frete grátis | `src/lib/data/store.ts` |
| Regras de frete | `src/lib/utils/shipping.ts` |
| Cores, tipografia e animações globais | `src/app.css` |
| Placeholder das fotos | `src/lib/components/PhotoPlaceholder.svelte` |

Para usar fotos reais, troque o `PhotoPlaceholder` por uma `<img>` (de preferência com `loading="lazy"` e
`srcset`) nos componentes `ProductCard`, `ProductView` e nas páginas.
