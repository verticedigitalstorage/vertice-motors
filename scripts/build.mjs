import { access } from "node:fs/promises";

const required = [
  "dist/index.html",
  "dist/styles.css",
  "dist/app.js",
  "dist/favicon.svg",
  "dist/assets/brand/vertice-logo-principal.svg",
  "dist/assets/brand/vertice-tokens.css",
  "dist/assets/brand/tipografia/manrope-400.ttf",
  "dist/assets/brand/tipografia/manrope-800.ttf",
  "dist/assets/motos/moto-urbana-grafite.webp",
  "dist/assets/motos/moto-adventure-vermelha.webp",
  "dist/assets/motos/moto-naked-azul.webp",
  "dist/assets/motos/moto-adventure-areia.webp",
  "dist/assets/motos/scooter-branca.webp",
  "dist/assets/motos/scooter-azul.webp",
  "dist/assets/motos/moto-urbana-prata.webp",
  "dist/assets/motos/moto-naked-vermelha.webp",
  "dist/assets/motos/moto-cruiser-grafite.webp",
  "dist/assets/motos/moto-premium-bronze.webp"
];
await Promise.all(required.map((file) => access(file)));
console.log("Vértice Motors validado. Publique a pasta dist/.");
