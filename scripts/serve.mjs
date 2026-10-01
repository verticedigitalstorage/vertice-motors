import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = 4173;
const root = join(process.cwd(), "dist");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png" };

createServer(async (request, response) => {
  const requested = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = requested === "/" ? "index.html" : requested.replace(/^\/+/, "");
  const file = normalize(join(root, relative));
  if (!file.startsWith(root)) { response.writeHead(403).end("Forbidden"); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream", "cache-control": "no-cache" });
    response.end(body);
  } catch {
    const body = await readFile(join(root, "index.html"));
    response.writeHead(200, { "content-type": types[".html"], "cache-control": "no-cache" });
    response.end(body);
  }
}).listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}`));
