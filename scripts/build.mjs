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
  "dist/assets/motos/moto-urbana-grafite.png",
  "dist/assets/motos/moto-adventure-vermelha.png",
  "dist/assets/motos/moto-naked-azul.png",
  "dist/assets/motos/scooter-branca.png",
  "dist/assets/motos/moto-cruiser-grafite.png",
  "dist/assets/motos/moto-premium-bronze.png"
];
await Promise.all(required.map((file) => access(file)));
console.log("Vértice Motors validado. Publique a pasta dist/.");
