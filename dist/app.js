/*
 * Vértice Motors — demonstração comercial independente.
 * Dados, veículos e imagens são exclusivamente demonstrativos.
 */
const CONFIG = {
  business: {
    name: "Vértice Motors",
    whatsapp: "",
    phoneDisplay: "Contato demonstrativo",
    instagram: "",
    instagramHandle: "",
    address: "",
    hours: ""
  },
  storageKey: "vertice-motors-demo-v1"
};

const DEMO_MOTOS = [
  { id: "honda-cg-160-titan", brand: "Honda", model: "CG 160 Titan", version: "ABS", year: 2025, km: 4800, cc: 160, price: 21990, image: "./assets/motos/moto-urbana-grafite.png", description: "Urbana ágil e econômica, com acabamento moderno e conjunto equilibrado para o uso diário.", sold: false },
  { id: "honda-bros-160", brand: "Honda", model: "NXR 160 Bros", version: "ESDD", year: 2024, km: 9200, cc: 160, price: 24790, image: "./assets/motos/moto-adventure-vermelha.png", description: "Suspensão elevada, posição confortável e versatilidade para cidade e trajetos irregulares.", sold: false },
  { id: "honda-cb-300f", brand: "Honda", model: "CB 300F Twister", version: "ABS", year: 2024, km: 7100, cc: 300, price: 28900, image: "./assets/motos/moto-naked-azul.png", description: "Naked de visual esportivo, freios ABS e desempenho seguro para rotina e estrada.", sold: false },
  { id: "honda-xre-300", brand: "Honda", model: "XRE 300 Sahara", version: "Adventure", year: 2025, km: 3100, cc: 300, price: 33990, image: "./assets/motos/moto-adventure-vermelha.png", description: "Projeto aventureiro com ergonomia elevada e recursos pensados para viagens e deslocamentos urbanos.", sold: false },
  { id: "honda-biz-125", brand: "Honda", model: "Biz 125", version: "EX", year: 2024, km: 5600, cc: 125, price: 16990, image: "./assets/motos/scooter-branca.png", description: "Praticidade urbana, baixo consumo e condução simples para todos os dias.", sold: false },
  { id: "honda-pcx-160", brand: "Honda", model: "PCX 160", version: "DLX ABS", year: 2025, km: 2400, cc: 160, price: 22900, image: "./assets/motos/scooter-branca.png", description: "Scooter premium com conforto, espaço e tecnologia para mobilidade urbana.", sold: false },
  { id: "yamaha-fazer-fz25", brand: "Yamaha", model: "Fazer FZ25", version: "ABS", year: 2023, km: 12800, cc: 250, price: 23490, image: "./assets/motos/moto-urbana-grafite.png", description: "Conjunto confiável, boa autonomia e posição de pilotagem confortável para uso misto.", sold: false },
  { id: "yamaha-mt-03", brand: "Yamaha", model: "MT-03", version: "ABS", year: 2024, km: 6800, cc: 321, price: 32900, image: "./assets/motos/moto-naked-azul.png", description: "Naked compacta de resposta esportiva, iluminação em LED e presença marcante.", sold: false },
  { id: "royal-enfield-meteor", brand: "Royal Enfield", model: "Meteor 350", version: "Supernova", year: 2023, km: 10500, cc: 349, price: 24900, image: "./assets/motos/moto-cruiser-grafite.png", description: "Cruiser confortável com estilo clássico, condução suave e excelente ergonomia.", sold: false },
  { id: "kawasaki-z500", brand: "Kawasaki", model: "Z500", version: "SE ABS", year: 2025, km: 1800, cc: 451, price: 43900, image: "./assets/motos/moto-premium-bronze.png", description: "Naked premium com entrega progressiva, componentes refinados e visual tecnológico.", sold: false }
].map(function (moto) { return Object.assign({}, moto, { images: [moto.image] }); });

const main = document.querySelector("main");
const toast = document.querySelector(".toast");
const toastMessage = document.querySelector("[data-toast-message]");
const toastClose = document.querySelector("[data-toast-close]");
const currentYear = new Date().getFullYear();
let activeBrand = "Todas";
let searchTerm = "";
let adminStatus = "Todas";
let adminSearch = "";
let lastSection = "";
let pendingToast = "";

function cloneDemo() {
  return JSON.parse(JSON.stringify(DEMO_MOTOS));
}

function getMotos() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey));
    const motos = Array.isArray(saved) ? saved : cloneDemo();
    return motos.map(function (moto) {
      return Object.assign({}, moto, { images: moto.image ? [moto.image] : [] });
    });
  } catch (error) {
    return cloneDemo();
  }
}

function saveMotos(motos) {
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(motos));
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function km(value) {
  return Number(value || 0).toLocaleString("pt-BR") + " km";
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>'"]/g, function (char) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char];
  });
}

function slugify(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function clearToast() {
  clearTimeout(showToast.timer);
  toast.classList.remove("show");
  toast.setAttribute("aria-hidden", "true");
  toast.hidden = true;
  toastClose.tabIndex = -1;
}

function showToast(message) {
  toastMessage.textContent = message;
  toast.hidden = false;
  toast.setAttribute("aria-hidden", "false");
  toastClose.tabIndex = 0;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(clearToast, 3800);
}

toastClose.addEventListener("click", clearToast);

function whatsappUrl(moto) {
  const phone = String(CONFIG.business.whatsapp || "").replace(/\D/g, "");
  const message = moto
    ? "Olá, Vértice! Estou testando a demo Vértice Motors e simulei interesse na " + moto.brand + " " + moto.model + "."
    : "Olá, Vértice! Conheci a demonstração Vértice Motors e gostaria de saber mais sobre um catálogo digital para minha revenda.";
  return "https://wa.me/" + (/^55\d{10,11}$/.test(phone) ? phone : "") + "?text=" + encodeURIComponent(message);
}

function bindWhatsapp(root) {
  (root || document).querySelectorAll("[data-whatsapp]").forEach(function (link) {
    const id = link.dataset.whatsapp;
    const moto = id && id !== "geral" ? getMotos().find(function (item) { return item.id === id; }) : null;
    const url = whatsappUrl(moto);
    if (!url) {
      link.hidden = true;
      link.removeAttribute("href");
      return;
    }
    link.hidden = false;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function renderBusinessInfo() {
  const links = document.querySelector("[data-business-links]");
  const business = CONFIG.business;
  const items = [];
  if (whatsappUrl()) items.push('<a data-whatsapp="geral" href="#">' + escapeHtml(business.phoneDisplay) + "</a>");
  if (business.instagram && business.instagramHandle) items.push('<a href="' + escapeHtml(business.instagram) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(business.instagramHandle) + "</a>");
  if (business.address) items.push("<span>" + escapeHtml(business.address) + "</span>");
  if (business.hours) items.push("<span>" + escapeHtml(business.hours) + "</span>");
  links.innerHTML = items.join("");
  bindWhatsapp(links);
}

const fallbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#0E1B2E"/><text x="50%" y="50%" fill="#9DAABD" font-family="Manrope,Arial" font-size="26" text-anchor="middle">Imagem indisponível</text></svg>';
const fallbackImage = "data:image/svg+xml," + encodeURIComponent(fallbackSvg);

function bindImageFallbacks(root) {
  (root || document).querySelectorAll("img[data-fallback]").forEach(function (image) {
    image.addEventListener("error", function () {
      image.src = fallbackImage;
      image.classList.add("image-fallback");
    }, { once: true });
  });
}

function motoCard(moto) {
  return [
    '<article class="moto-card"><a href="#moto/', encodeURIComponent(moto.id), '" aria-label="Ver detalhes de ', escapeHtml(moto.brand), " ", escapeHtml(moto.model), '">',
    '<div class="moto-photo"><img data-fallback src="', escapeHtml(moto.image), '" alt="', escapeHtml(moto.brand), " ", escapeHtml(moto.model), '" loading="lazy" /><span class="moto-tag">DISPONÍVEL</span></div>',
    '<div class="moto-card-body"><span class="moto-brand">', escapeHtml(moto.brand), "</span><h3>", escapeHtml(moto.model), '</h3><div class="moto-meta"><span>', escapeHtml(moto.year), "</span><span>", km(moto.km), "</span></div>",
    '<div class="moto-price-row"><div class="moto-price"><span>Valor</span><strong>', money(moto.price), '</strong></div><span class="text-link">Detalhes</span></div></div></a></article>'
  ].join("");
}

function availableBrands() {
  const brands = new Map();
  getMotos().filter(function (moto) { return !moto.sold && moto.brand; }).forEach(function (moto) {
    const brand = moto.brand.trim();
    const key = brand.toLocaleLowerCase("pt-BR");
    if (!brands.has(key)) brands.set(key, brand);
  });
  return Array.from(brands.values()).sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
}

function homeTemplate() {
  const brands = availableBrands();
  if (activeBrand !== "Todas" && brands.indexOf(activeBrand) === -1) activeBrand = "Todas";
  const filters = ["Todas"].concat(brands).map(function (brand) {
    const active = activeBrand === brand;
    return '<button type="button" class="filter ' + (active ? "active" : "") + '" aria-pressed="' + active + '" data-brand="' + escapeHtml(brand) + '">' + escapeHtml(brand) + "</button>";
  }).join("");
  return [
    '<section class="hero"><div class="hero-grid" aria-hidden="true"></div><picture class="hero-media"><img src="./assets/motos/moto-naked-azul.png" alt="Motocicleta demonstrativa em estúdio" fetchpriority="high" /></picture>',
    '<div class="hero-content"><p class="section-kicker">Vértice Motors · demonstração oficial</p><h1>Seu estoque. <span>Pronto para vender.</span></h1><p>Uma experiência completa para apresentar motos, receber contatos e manter o catálogo atualizado com autonomia.</p>',
    '<div class="hero-actions"><a class="btn btn-primary" href="#motos">Explorar estoque</a><a class="btn btn-secondary" href="#admin">Ver painel administrativo</a></div><div class="hero-proof"><span>Catálogo responsivo</span><span>Gestão simplificada</span><span>Atendimento integrado</span></div></div></section>',
    '<section class="section page-shell" id="catalogo"><div class="catalog-header"><div><p class="section-kicker">Estoque demonstrativo</p><h2 class="section-title">Motos em destaque</h2></div><div class="catalog-tools">',
    '<label class="search-box"><span class="sr-only">Buscar por modelo</span><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg><input id="moto-search" type="search" placeholder="Buscar por modelo" value="', escapeHtml(searchTerm), '" /></label>',
    '<div class="filters" aria-label="Filtrar por marca">', filters, '</div></div></div><p class="demo-notice">Ambiente demonstrativo — veículos, valores, imagens e informações são fictícios.</p><div class="moto-grid" id="moto-grid"></div></section>',
    '<section class="section trust-section" id="como-funciona"><div class="page-shell"><p class="section-kicker">Produto pensado para revendas</p><h2 class="section-title">Tudo o que a equipe precisa para vender melhor.</h2><div class="trust-grid">',
    '<div class="trust-item"><span class="trust-number">01</span><strong>Estoque organizado</strong><span>Busca, filtros e páginas completas para cada veículo.</span></div><div class="trust-item"><span class="trust-number">02</span><strong>Contato em contexto</strong><span>O cliente chama já informando qual moto despertou interesse.</span></div><div class="trust-item"><span class="trust-number">03</span><strong>Autonomia comercial</strong><span>Preço, fotos, dados e disponibilidade podem ser atualizados pela equipe.</span></div>',
    '</div></div></section>'
  ].join("");
}

function renderCatalog() {
  const grid = document.querySelector("#moto-grid");
  if (!grid) return;
  const term = searchTerm.trim().toLocaleLowerCase("pt-BR");
  const filtered = getMotos().filter(function (moto) {
    if (moto.sold) return false;
    const brandMatch = activeBrand === "Todas" || moto.brand === activeBrand;
    return brandMatch && (moto.brand + " " + moto.model + " " + moto.version).toLocaleLowerCase("pt-BR").includes(term);
  });
  grid.innerHTML = filtered.length
    ? filtered.map(motoCard).join("")
    : '<div class="empty-state"><h3>Nenhuma moto encontrada com esses filtros.</h3><button type="button" class="btn btn-ghost" id="clear-public-filters">Limpar filtros</button></div>';
  bindImageFallbacks(grid);
  const clear = document.querySelector("#clear-public-filters");
  if (clear) clear.addEventListener("click", function () {
    activeBrand = "Todas";
    searchTerm = "";
    renderHome("motos");
  });
}

function bindCatalog() {
  document.querySelectorAll(".filter[data-brand]").forEach(function (button) {
    button.addEventListener("click", function () {
      activeBrand = button.dataset.brand;
      document.querySelectorAll(".filter[data-brand]").forEach(function (item) {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      renderCatalog();
    });
  });
  const search = document.querySelector("#moto-search");
  if (search) search.addEventListener("input", function (event) {
    searchTerm = event.target.value;
    renderCatalog();
  });
}

function renderHome(target) {
  main.innerHTML = homeTemplate();
  renderCatalog();
  bindCatalog();
  bindWhatsapp(main);
  if (target === "motos") requestAnimationFrame(function () { document.querySelector("#catalogo").scrollIntoView(); });
  if (target === "como-funciona") requestAnimationFrame(function () { document.querySelector("#como-funciona").scrollIntoView(); });
  if (target === "contato") requestAnimationFrame(function () { document.querySelector("#contato").scrollIntoView(); });
}

function renderDetail(id) {
  const moto = getMotos().find(function (item) { return item.id === id; });
  if (!moto || moto.sold) {
    main.innerHTML = '<section class="section page-shell not-found"><p class="section-kicker">Catálogo demonstrativo</p><h1>Moto não encontrada</h1><p class="section-copy">Ela pode ter sido marcada como vendida ou removida durante a demonstração.</p><div class="hero-actions"><a class="btn btn-primary" href="#admin">Ver painel demo</a><a class="btn btn-ghost" href="#motos">Voltar ao catálogo</a></div></section>';
    bindWhatsapp(main);
    return;
  }
  main.innerHTML = [
    '<section class="detail-wrap page-shell"><a class="back-link" href="#motos">← Voltar para as motos</a><div class="detail-grid"><div class="detail-gallery"><div class="detail-main-image"><img data-fallback src="', escapeHtml(moto.image), '" alt="', escapeHtml(moto.brand), " ", escapeHtml(moto.model), '" /></div></div><div class="detail-info">',
    '<p class="section-kicker">', escapeHtml(moto.brand), ' · Disponível</p><h1>', escapeHtml(moto.model), '</h1><div class="detail-price"><span>Valor anunciado</span><strong>', money(moto.price), "</strong></div>",
    '<div class="spec-grid"><div class="spec"><span>Ano</span><strong>', escapeHtml(moto.year), '</strong></div><div class="spec"><span>Quilometragem</span><strong>', km(moto.km), '</strong></div><div class="spec"><span>Cilindrada</span><strong>', escapeHtml(moto.cc), ' cc</strong></div><div class="spec"><span>Versão</span><strong>', escapeHtml(moto.version || "—"), "</strong></div></div>",
    '<p class="detail-description">', escapeHtml(moto.description), '</p><div class="interest-box"><a class="btn btn-primary" data-whatsapp="', escapeHtml(moto.id), '" href="#">Falar sobre esta moto</a></div></div></div></section>'
  ].join("");
  bindImageFallbacks(main);
  bindWhatsapp(main);
}

function showConfirmDialog(options) {
  const root = document.querySelector("#dialog-root");
  root.innerHTML = '<dialog class="confirm-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description"><div class="dialog-card"><h2 id="dialog-title">' + escapeHtml(options.title) + '</h2><p id="dialog-description">' + escapeHtml(options.message) + '</p><div class="dialog-actions"><button type="button" class="btn btn-ghost" data-dialog-cancel>Cancelar</button><button type="button" class="btn ' + (options.danger ? "btn-danger-solid" : "btn-primary") + '" data-dialog-confirm>' + escapeHtml(options.confirmLabel) + "</button></div></div></dialog>";
  const dialog = root.querySelector("dialog");
  const cancel = root.querySelector("[data-dialog-cancel]");
  cancel.addEventListener("click", function () { dialog.close(); });
  root.querySelector("[data-dialog-confirm]").addEventListener("click", function () {
    dialog.close();
    options.onConfirm();
  });
  dialog.addEventListener("close", function () {
    root.innerHTML = "";
    if (options.trigger && document.contains(options.trigger)) options.trigger.focus();
  }, { once: true });
  dialog.showModal();
  cancel.focus();
}

function adminStats(motos) {
  const sold = motos.filter(function (moto) { return moto.sold; }).length;
  return '<div class="stats-grid"><div class="stat"><span>Total</span><strong>' + motos.length + '</strong></div><div class="stat"><span>Publicadas</span><strong>' + (motos.length - sold) + '</strong></div><div class="stat"><span>Vendidas</span><strong>' + sold + "</strong></div></div>";
}

function renderAdmin() {
  const motos = getMotos();
  const term = adminSearch.trim().toLocaleLowerCase("pt-BR");
  const filtered = motos.filter(function (moto) {
    const statusMatch = adminStatus === "Todas" || (adminStatus === "Publicadas" && !moto.sold) || (adminStatus === "Vendidas" && moto.sold);
    return statusMatch && (moto.brand + " " + moto.model + " " + moto.version).toLocaleLowerCase("pt-BR").includes(term);
  });
  const statusFilters = ["Todas", "Publicadas", "Vendidas"].map(function (status) {
    const active = status === adminStatus;
    return '<button type="button" class="filter ' + (active ? "active" : "") + '" aria-pressed="' + active + '" data-admin-status="' + status + '">' + status + "</button>";
  }).join("");
  let list = "";
  if (!motos.length) {
    list = '<div class="empty-state admin-empty"><h2>Nenhuma moto cadastrada.</h2><p>Adicione a primeira moto para começar.</p><a class="btn btn-primary" href="#admin/novo">Adicionar moto</a></div>';
  } else if (!filtered.length) {
    list = '<div class="empty-state"><h2>Nenhuma moto encontrada.</h2><button class="btn btn-ghost" id="clear-admin-filters" type="button">Limpar filtros</button></div>';
  } else {
    list = filtered.map(function (moto) {
      return [
        '<article class="admin-row"><img data-fallback src="', escapeHtml(moto.image), '" alt="" /><div><h3>', escapeHtml(moto.brand), " ", escapeHtml(moto.model), "</h3><p>", escapeHtml(moto.year), " · ", km(moto.km), " · ", money(moto.price), '</p><span class="status-pill ', moto.sold ? "sold" : "", '">', moto.sold ? "VENDIDA" : "PUBLICADA", "</span></div>",
        '<div class="admin-actions"><a class="btn btn-ghost btn-small" href="#admin/editar/', encodeURIComponent(moto.id), '">Editar</a><button class="btn btn-status btn-small" type="button" data-action="sold" data-id="', escapeHtml(moto.id), '">', moto.sold ? "Reativar" : "Marcar vendida", '</button><button class="btn btn-danger btn-small" type="button" data-action="delete" data-id="', escapeHtml(moto.id), '">Excluir</button></div></article>'
      ].join("");
    }).join("");
  }
  main.innerHTML = [
    '<section class="admin-shell"><a class="back-link" href="#home">← Ver catálogo público</a><div class="admin-top"><div><p class="section-kicker">GESTÃO DE ESTOQUE</p><h1>Gerenciar motos</h1></div><a class="btn btn-primary" href="#admin/novo">+ Adicionar moto</a></div>',
    '<div class="admin-banner"><strong>Modo demo seguro</strong><span>Acesso demonstrativo. Em projetos reais, o painel é protegido e restrito à equipe da empresa.</span></div><div class="admin-capabilities"><span>Adicionar veículo</span><span>Editar preço e dados</span><span>Gerenciar imagens</span><span>Controlar status</span></div>', adminStats(motos),
    '<div class="admin-filters"><label class="search-box"><span class="sr-only">Buscar por marca ou modelo</span><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg><input id="admin-search" type="search" placeholder="Buscar por marca ou modelo" value="', escapeHtml(adminSearch), '" /></label><div class="filters" aria-label="Filtrar estoque por status">', statusFilters, '</div></div><div class="admin-list">', list, '</div><div class="admin-toolbar"><button class="btn btn-ghost btn-small" type="button" id="reset-demo">Restaurar demonstração</button></div></section>'
  ].join("");

  bindImageFallbacks(main);
  const adminSearchInput = document.querySelector("#admin-search");
  if (adminSearchInput) adminSearchInput.addEventListener("input", function (event) {
    adminSearch = event.target.value;
    renderAdmin();
    const next = document.querySelector("#admin-search");
    next.focus();
    next.setSelectionRange(next.value.length, next.value.length);
  });
  main.querySelectorAll("[data-admin-status]").forEach(function (button) {
    button.addEventListener("click", function () {
      adminStatus = button.dataset.adminStatus;
      renderAdmin();
    });
  });
  const clear = document.querySelector("#clear-admin-filters");
  if (clear) clear.addEventListener("click", function () {
    adminSearch = "";
    adminStatus = "Todas";
    renderAdmin();
  });
  main.querySelectorAll("[data-action='sold']").forEach(function (button) {
    button.addEventListener("click", function () {
      saveMotos(getMotos().map(function (moto) {
        return moto.id === button.dataset.id ? Object.assign({}, moto, { sold: !moto.sold }) : moto;
      }));
      renderAdmin();
      showToast("Status atualizado no catálogo.");
    });
  });
  main.querySelectorAll("[data-action='delete']").forEach(function (button) {
    button.addEventListener("click", function () {
      const moto = getMotos().find(function (item) { return item.id === button.dataset.id; });
      showConfirmDialog({
        title: "Excluir moto?",
        message: (moto ? moto.brand + " " + moto.model : "Esta moto") + " será removida do catálogo e do painel neste navegador.",
        confirmLabel: "Excluir",
        danger: true,
        trigger: button,
        onConfirm: function () {
          saveMotos(getMotos().filter(function (item) { return item.id !== button.dataset.id; }));
          renderAdmin();
          showToast("Moto excluída.");
        }
      });
    });
  });
  document.querySelector("#reset-demo").addEventListener("click", function (event) {
    showConfirmDialog({
      title: "Restaurar demonstração?",
      message: "Todas as alterações feitas neste dispositivo serão substituídas pelos dados iniciais.",
      confirmLabel: "Restaurar",
      trigger: event.currentTarget,
      onConfirm: function () {
        localStorage.removeItem(CONFIG.storageKey);
        adminSearch = "";
        adminStatus = "Todas";
        renderAdmin();
        showToast("Demonstração restaurada.");
      }
    });
  });
}

async function compressImage(file) {
  const accepted = ["image/jpeg", "image/png", "image/webp"];
  if (!accepted.includes(file && file.type)) throw new Error("type");
  if (file.size > 10 * 1024 * 1024) throw new Error("size");
  let source;
  try {
    source = await createImageBitmap(file);
  } catch (error) {
    source = await new Promise(function (resolve, reject) {
      const reader = new FileReader();
      const image = new Image();
      reader.onerror = reject;
      image.onerror = reject;
      image.onload = function () { resolve(image); };
      reader.onload = function () { image.src = reader.result; };
      reader.readAsDataURL(file);
    });
  }
  const maxSide = 1400;
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas");
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  if (source.close) source.close();
  const webp = canvas.toDataURL("image/webp", 0.82);
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.82);
}

function requiredLabel(text) {
  return text + ' <span class="required" aria-hidden="true">*</span>';
}

function renderFormNotFound() {
  main.innerHTML = '<section class="admin-shell not-found"><p class="section-kicker">GESTÃO DE ESTOQUE</p><h1>Cadastro não encontrado</h1><p class="section-copy">Esta moto pode ter sido excluída ou o link está desatualizado.</p><a class="btn btn-primary" href="#admin">Voltar ao painel</a></section>';
}

function fieldMarkup(name, label, value, attributes) {
  return '<div class="field"><label for="' + name + '">' + requiredLabel(label) + '</label><input id="' + name + '" name="' + name + '" ' + (attributes || "") + ' value="' + escapeHtml(value) + '" aria-describedby="' + name + '-error" /><span class="field-error" id="' + name + '-error"></span></div>';
}

function renderMotoForm(id) {
  const editing = Boolean(id);
  const moto = editing ? getMotos().find(function (item) { return item.id === id; }) : null;
  if (editing && !moto) return renderFormNotFound();
  const values = moto || { brand: "", model: "", version: "", year: "", km: "", cc: "", price: "", description: "", image: "", sold: false };
  const brandOptions = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "BMW", "Royal Enfield", "Triumph"].map(function (brand) { return '<option value="' + brand + '"></option>'; }).join("");
  main.innerHTML = [
    '<section class="admin-shell"><a class="back-link" href="#admin">← Voltar para gerenciar motos</a><div class="admin-top"><div><p class="section-kicker">GESTÃO DE ESTOQUE</p><h1>', editing ? "Editar moto" : "Adicionar moto", '</h1><p class="admin-note">Os campos com <span class="required">*</span> são obrigatórios.</p></div></div><form class="form-card" id="moto-form" novalidate><div class="form-grid">',
    '<div class="field"><label for="brand">', requiredLabel("Marca"), '</label><input id="brand" name="brand" list="brand-suggestions" value="', escapeHtml(values.brand), '" placeholder="Ex.: Honda" aria-describedby="brand-error" /><datalist id="brand-suggestions">', brandOptions, '</datalist><span class="field-error" id="brand-error"></span></div>',
    fieldMarkup("model", "Modelo", values.model, 'placeholder="Ex.: CG 160 Titan"'), '<div class="field"><label for="version">Versão</label><input id="version" name="version" value="', escapeHtml(values.version), '" placeholder="Ex.: Titan" /></div>',
    fieldMarkup("year", "Ano", values.year, 'type="number" min="1980" max="' + (currentYear + 1) + '"'), fieldMarkup("km", "Quilometragem", values.km, 'type="number" min="0"'), fieldMarkup("cc", "Cilindrada", values.cc, 'type="number" min="1"'), fieldMarkup("price", "Preço (R$)", values.price, 'type="number" min="1"'),
    '<div class="field form-wide"><label>', requiredLabel("Foto principal"), '</label><div class="upload-box"><input class="sr-only" id="upload" type="file" accept="image/jpeg,image/png,image/webp" /><label class="btn btn-ghost" for="upload">Escolher foto</label><span id="upload-name">JPG, PNG ou WebP · até 10 MB</span></div><input id="image" name="image" type="hidden" value="', escapeHtml(values.image), '" aria-describedby="image-error" /><span class="field-error" id="image-error"></span>',
    '<details class="advanced-options"><summary>Opções avançadas</summary><label for="image-url">Usar URL ou caminho da imagem</label><input id="image-url" type="text" value="', escapeHtml(values.image && !values.image.startsWith("data:") ? values.image : ""), '" placeholder="https://... ou ./assets/foto.jpg" /></details></div>',
    '<div class="field form-wide preview-wrap ', values.image ? "" : "is-empty", '"><img class="image-preview" data-fallback id="image-preview" src="', escapeHtml(values.image || fallbackImage), '" alt="Pré-visualização da moto" /><button type="button" class="btn btn-danger btn-small" id="remove-image">Remover foto</button></div>',
    '<div class="field form-wide"><label for="description">', requiredLabel("Descrição"), '</label><textarea id="description" name="description" aria-describedby="description-error">', escapeHtml(values.description), '</textarea><span class="field-error" id="description-error"></span></div></div>',
    '<div class="form-actions"><button class="btn btn-primary" type="submit">', editing ? "Salvar alterações" : "Publicar moto", '</button><a class="btn btn-ghost" href="#admin">Cancelar</a></div></form></section>'
  ].join("");

  const form = document.querySelector("#moto-form");
  const imageInput = document.querySelector("#image");
  const imageUrl = document.querySelector("#image-url");
  const previewWrap = document.querySelector(".preview-wrap");
  const preview = document.querySelector("#image-preview");
  const upload = document.querySelector("#upload");
  function setImage(value) {
    imageInput.value = value;
    preview.src = value || fallbackImage;
    previewWrap.classList.toggle("is-empty", !value);
    document.querySelector("#image-error").textContent = "";
    imageInput.removeAttribute("aria-invalid");
  }
  imageUrl.addEventListener("input", function () { setImage(imageUrl.value.trim()); });
  document.querySelector("#remove-image").addEventListener("click", function () {
    upload.value = "";
    imageUrl.value = "";
    document.querySelector("#upload-name").textContent = "JPG, PNG ou WebP · até 10 MB";
    setImage("");
  });
  upload.addEventListener("change", async function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      upload.disabled = true;
      setImage(await compressImage(file));
      imageUrl.value = "";
      document.querySelector("#upload-name").textContent = file.name;
    } catch (error) {
      const message = error.message === "type" ? "Escolha uma imagem em JPG, PNG ou WebP." : error.message === "size" ? "A imagem deve ter no máximo 10 MB." : "Não foi possível processar esta imagem.";
      document.querySelector("#image-error").textContent = message;
      imageInput.setAttribute("aria-invalid", "true");
      upload.value = "";
    } finally {
      upload.disabled = false;
    }
  });

  function validate() {
    const data = Object.fromEntries(new FormData(form));
    const rules = {
      brand: !data.brand.trim() ? "Selecione uma marca." : "",
      model: !data.model.trim() ? "Informe o modelo." : "",
      year: !data.year || Number(data.year) < 1980 || Number(data.year) > currentYear + 1 ? "Informe um ano entre 1980 e " + (currentYear + 1) + "." : "",
      km: data.km === "" || Number(data.km) < 0 ? "Informe uma quilometragem válida." : "",
      cc: !data.cc || Number(data.cc) <= 0 ? "Informe uma cilindrada válida." : "",
      price: !data.price || Number(data.price) <= 0 ? "Informe um preço maior que zero." : "",
      image: !data.image.trim() ? "Adicione uma foto principal." : "",
      description: !data.description.trim() ? "Escreva uma descrição." : ""
    };
    let firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      const input = form.elements[name];
      const message = rules[name];
      document.querySelector("#" + name + "-error").textContent = message;
      if (message) {
        input.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = name === "image" ? upload : input;
      } else {
        input.removeAttribute("aria-invalid");
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return { valid: !firstInvalid, data: data };
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const result = validate();
    if (!result.valid) return;
    const data = result.data;
    const saved = getMotos();
    const nextMoto = {
      id: editing ? moto.id : slugify(data.brand) + "-" + slugify(data.model) + "-" + Date.now(),
      brand: data.brand.trim(), model: data.model.trim(), version: data.version.trim(),
      year: Number(data.year), km: Number(data.km), cc: Number(data.cc), price: Number(data.price),
      image: data.image.trim(), images: [data.image.trim()], description: data.description.trim(),
      sold: editing ? moto.sold : false
    };
    try {
      saveMotos(editing ? saved.map(function (item) { return item.id === moto.id ? nextMoto : item; }) : [nextMoto].concat(saved));
    } catch (error) {
      showToast("Não foi possível salvar esta imagem. Tente uma foto menor.");
      return;
    }
    pendingToast = editing ? "Alterações salvas." : "Moto publicada no catálogo.";
    if (location.hash === "#admin") renderRoute();
    else location.hash = "#admin";
  });
}

function setActiveNav(route) {
  document.querySelectorAll("[data-nav]").forEach(function (link) {
    const active = link.dataset.nav === route;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function renderRoute() {
  clearToast();
  const route = location.hash.replace(/^#/, "") || "home";
  const parts = route.split("/");
  const section = parts[0];
  if (lastSection === "admin" && section !== "admin") {
    activeBrand = "Todas";
    searchTerm = "";
  }
  lastSection = section;
  document.body.dataset.route = section;
  window.scrollTo({ top: 0, behavior: "instant" });
  if (section === "moto") renderDetail(decodeURIComponent(parts[1] || ""));
  else if (section === "admin" && parts[1] === "novo") renderMotoForm();
  else if (section === "admin" && parts[1] === "editar") renderMotoForm(decodeURIComponent(parts[2] || ""));
  else if (section === "admin") renderAdmin();
  else renderHome(section);
  setActiveNav(["home", "motos", "como-funciona"].includes(section) ? section : "");
  bindWhatsapp(document);
  bindImageFallbacks(main);
  const moto = section === "moto" ? getMotos().find(function (item) { return item.id === decodeURIComponent(parts[1] || ""); }) : null;
  document.title = section === "admin" ? "Painel demonstrativo — Vértice Motors" : moto ? moto.brand + " " + moto.model + " | Vértice Motors" : "Vértice Motors — Demo de catálogo digital";
  if (pendingToast) {
    const message = pendingToast;
    pendingToast = "";
    requestAnimationFrame(function () { showToast(message); });
  }
}

renderBusinessInfo();
window.VerticeMotorsDemo = { getMotos: getMotos, saveMotos: saveMotos, whatsappUrl: whatsappUrl };
window.addEventListener("hashchange", renderRoute);
renderRoute();
