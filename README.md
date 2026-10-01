# Vértice Motors — demo comercial independente

Site estático em HTML, CSS e JavaScript. O catálogo e o painel demonstrativo usam somente `localStorage`; não há backend, autenticação, credenciais ou banco de dados.

Todos os veículos, valores e informações são fictícios. O projeto é independente de qualquer revenda real.

## Comandos

```bash
npm install
npm run dev
npm run build
```

Acesse `http://127.0.0.1:4173/`. O painel fica em `/#admin`.

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: raiz do repositório

As informações configuráveis e os dados demonstrativos ficam no início de `dist/app.js`. As imagens de catálogo foram criadas exclusivamente para esta demonstração.
