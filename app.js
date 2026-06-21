// ============================================================
// AUTOCOMPARA — Lógica principal
// ============================================================
let marcasSelecionadas = new Set();
let carrosSelecionados = [];
let carrosFiltrados    = [];
let categoriaSelecionada = "Todos";
const CACHE_IMAGENS_KEY = 'autocompara_img_cache';
// ---- IMAGES & FILTERS HELPERS ----
function getCachedImage(id) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_IMAGENS_KEY) || '{}');
    return cache[id];
  } catch (e) {
    return null;
  }
}
function setCachedImage(id, url) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_IMAGENS_KEY) || '{}');
    cache[id] = url;
    localStorage.setItem(CACHE_IMAGENS_KEY, JSON.stringify(cache));
  } catch (e) {}
}
async function buscarFotoCarro(marca, nome, id) {
  const cached = getCachedImage(id);
  if (cached) return cached;
  const query = `${marca} ${nome}`;
  const url = 'https://commons.wikimedia.org/w/api.php';
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${query} car`,
    gsrlimit: '1',
    gsrnamespace: '6', // File namespace
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '400',
    origin: '*'
  });
  try {
    const res = await fetch(`${url}?${params.toString()}`);
    const data = await res.json();
    if (data.query && data.query.pages) {
      const pageId = Object.keys(data.query.pages)[0];
      const page = data.query.pages[pageId];
      if (page.imageinfo && page.imageinfo[0]) {
        const imgUrl = page.imageinfo[0].thumburl || page.imageinfo[0].url;
        setCachedImage(id, imgUrl);
        return imgUrl;
      }
    }
  } catch (error) {
    console.warn(`Erro ao buscar imagem para ${query}:`, error);
  }
  return '';
}
function carregarImagemCarro(marcaId, query, carroId) {
  const container = document.querySelector(`#car-${carroId} .car-img-wrap`);
  if (!container) return;
  const cached = getCachedImage(carroId);
  if (cached) {
    const img = document.createElement('img');
    img.src = cached;
    img.alt = query;
    img.className = 'car-photo-loaded car-photo-visible';
    container.appendChild(img);
    return;
  }
  buscarFotoCarro(marcaId, query, carroId).then(imgUrl => {
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = query;
      img.className = 'car-photo-loaded';
      img.onload = () => {
        container.appendChild(img);
        requestAnimationFrame(() => {
          img.classList.add('car-photo-visible');
        });
      };
    }
  });
}
function normalizarCategoria(cat) {
  if (!cat) return "";
  const lower = cat.toLowerCase();
  if (lower.includes("hatch")) return "Hatch";
  if (lower.includes("suv")) return "SUV";
  if (lower.includes("sedan") || lower.includes("sedã")) return "Sedan";
  if (lower.includes("picape") || lower.includes("pick-up") || lower.includes("pickup") || lower.includes("caçamba")) return "Picape";
  if (lower.includes("minivan") || lower.includes("van") || lower.includes("monovolume")) return "Minivan";
  if (lower.includes("furgão") || lower.includes("furgao")) return "Furgão";
  return "Outros";
}
function renderCategoryFilters() {
  const wrap = document.getElementById('categoryFilterWrap');
  if (!wrap) return;
  const categorias = ["Todos", "Hatch", "SUV", "Sedan", "Picape", "Minivan", "Furgão"];
  wrap.innerHTML = `
    <span class="filter-label">Filtrar por Categoria:</span>
    <div class="category-filters">
      ${categorias.map(cat => `
        <button class="filter-chip ${categoriaSelecionada === cat ? 'active' : ''}" data-category="${cat}">
          ${cat}
        </button>
      `).join('')}
    </div>
  `;
  wrap.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      categoriaSelecionada = cat;
      wrap.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCars();
    });
  });
}
// ---- INIT ----
document.addEventListener('DOMContentLoaded', async () => {
  await carregarPlanilha(); // carrega os dados do Google Sheets
  carrosSelecionados = [];
  carrosFiltrados = CARROS.filter(c => marcasSelecionadas.has(c.marca));
  categoriaSelecionada = "Todos";
  const section = document.getElementById('veiculos');
  if (section) {
    section.classList.remove('hidden');
    renderCategoryFilters();
    renderCars();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
    return;
  }
  grid.innerHTML = carrosFiltrados.map(c => {
  // Filter cars based on selected category
  let carsToShow = carrosFiltrados;
  if (categoriaSelecionada !== "Todos") {
    carsToShow = carrosFiltrados.filter(c => normalizarCategoria(c.categoria) === categoriaSelecionada);
  }
  if (carsToShow.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--white-dim); padding: 2rem 0;">Nenhum veículo disponível nesta categoria para as marcas selecionadas.</p>`;
    atualizarBotaoComparar();
    return;
  }
  grid.innerHTML = carsToShow.map(c => {
    const marca = MARCAS.find(m => m.id === c.marca);
    const precoFmt = c.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    const fallbackUrl = marca ? marca.logo : '';
    const isSelected = carrosSelecionados.includes(c.id);
    return `
      <div class="car-card" id="car-${c.id}" data-id="${c.id}">
      <div class="car-card ${isSelected ? 'selected' : ''}" id="car-${c.id}" data-id="${c.id}">
        <div class="car-img-wrap" style="background: var(--gray-dark); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
          <span class="car-badge">${c.categoria}</span>
          <div class="car-sel-badge">✓</div>
    `;
  }).join('');
  // Trigger dynamic car image loading
  carsToShow.forEach(c => {
    carregarImagemCarro(c.marca, `${c.marca} ${c.nome}`, c.id);
  });
  // Attach event listeners programmatically to bypass scoping limits
  grid.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('click', () => {
    const marca  = MARCAS.find(m => m.id === c.marca);
    const precoFmt = c.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    const fallbackUrl = marca ? marca.logo : '';
    const cachedImg = getCachedImage(c.id);
    return `
      <div class="comp-card ${isWinner ? 'winner' : ''}">
        ${isWinner ? '<span class="winner-badge">🏆 Melhor custo-benefício</span>' : ''}
        <div class="comp-car-img" style="background: var(--gray-dark); display: flex; align-items: center; justify-content: center; height: 160px; padding: 1.25rem;">
        <div class="comp-car-img" style="background: var(--gray-dark); display: flex; align-items: center; justify-content: center; height: 160px; padding: 1.25rem; position: relative;">
          ${cachedImg ? `
            <img src="${cachedImg}" alt="${c.nome}" class="car-photo-loaded car-photo-visible" />
          ` : ''}
          ${marca ? `
            <img src="logos/${marca.id}.png" alt="${marca.nome}" style="max-height: 90px; width: auto; height: auto; object-fit: contain;"
            <img src="logos/${marca.id}.png" alt="${marca.nome}" style="max-height: 90px; width: auto; height: auto; object-fit: contain; ${cachedImg ? 'display: none;' : ''}"
              onerror="this.onerror=null; this.src='logos/${marca.id}.jpg'; this.addEventListener('error', () => { this.onerror=null; this.src='logos/${marca.id}.jpeg'; this.addEventListener('error', () => { this.onerror=null; this.src='${fallbackUrl}'; this.addEventListener('error', () => { this.style.display='none'; this.nextElementSibling.style.display='flex'; }) }) })" />
            <div class="car-emoji-placeholder" style="display:none;align-items:center;justify-content:center;height:100%;opacity:0.4;font-size:3rem">🚗</div>
          ` : `
      </div>
    `;
  }).join('');
  // Load photos dynamically in comparison if not in cache
  carros.forEach((c, idx) => {
    const container = wrap.querySelectorAll('.comp-car-img')[idx];
    if (container && !getCachedImage(c.id)) {
      buscarFotoCarro(c.marca, `${c.marca} ${c.nome}`, c.id).then(url => {
        if (url) {
          const img = document.createElement('img');
          img.src = url;
          img.alt = c.nome;
          img.className = 'car-photo-loaded car-photo-visible';
          const logoImg = container.querySelector('img:not(.car-photo-loaded)');
          if (logoImg) logoImg.style.display = 'none';
          container.appendChild(img);
        }
      });
    }
  });
}
function miniScore(label, val) {
// EQUIPE
// ============================================================
const EQUIPE = [
  { nome: "Eduarda Nobre",      iniciais: "EN", foto: "fotos/eduarda.jpeg" },
  { nome: "Thaís Domingues",    iniciais: "TD", foto: "fotos/thais.jpeg" },
  { nome: "William Bertolotto", iniciais: "WB", foto: "fotos/william.jpeg" },
  { nome: "Diana Soares",       iniciais: "DS", foto: "fotos/diana.jpeg" },
  { nome: "Taynara Sales",      iniciais: "TS", foto: "fotos/taynara.jpeg" },
  { nome: "Douglas",            iniciais: "DG", foto: "fotos/douglas.jpeg" },
  { nome: "Eduarda Nobre",      iniciais: "EN", foto: "fotos/eduarda.jpeg", linkedin: "https://www.linkedin.com/in/eduardanobree/" },
  { nome: "Thaís Domingues",    iniciais: "TD", foto: "fotos/thais.jpeg",   linkedin: "https://www.linkedin.com/in/thais-domingues/" },
  { nome: "William Bertolotto", iniciais: "WB", foto: "fotos/william.jpeg", linkedin: "https://www.linkedin.com/in/williambertolotto/" },
  { nome: "Diana Soares",       iniciais: "DS", foto: "fotos/diana.jpeg",   linkedin: "https://www.linkedin.com/in/diana-soares-analista-dados/" },
  { nome: "Taynara Sales",      iniciais: "TS", foto: "fotos/taynara.jpeg", linkedin: "https://www.linkedin.com/in/taynara-sales-213113203/" },
  { nome: "Douglas Prudenciano",iniciais: "DG", foto: "fotos/douglas.jpeg", linkedin: "https://www.linkedin.com/in/douglas-prudenciano/" },
];
function renderTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  grid.innerHTML = EQUIPE.map(p => `
    <div class="team-card">
      <div class="team-avatar" id="avatar-${p.iniciais}">
        ${p.foto
          ? `<img src="${p.foto}" alt="${p.nome}" onerror="this.parentElement.innerHTML='${p.iniciais}'" />`
          : p.iniciais
        }
      </div>
      <a href="${p.linkedin}" target="_blank" rel="noopener noreferrer" class="team-avatar-link" title="Ver LinkedIn de ${p.nome}">
        <div class="team-avatar" id="avatar-${p.iniciais}">
          ${p.foto
            ? `<img src="${p.foto}" alt="${p.nome}" onerror="this.parentElement.innerHTML='${p.iniciais}'" />`
            : p.iniciais
          }
        </div>
        <div class="team-linkedin-badge">in</div>
      </a>
      <div class="team-name">${p.nome}</div>
      <div class="team-role">Análise de Dados</div>
    </div>
window.mostrarComparativo = mostrarComparativo;
window.resetar = resetar;
