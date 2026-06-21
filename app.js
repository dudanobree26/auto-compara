// ============================================================
// AUTOCOMPARA — Lógica principal
// ============================================================

let marcasSelecionadas = new Set();
let carrosSelecionados = [];
let carrosFiltrados    = [];
let categoriaSelecionada = "Todos";


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
  renderBrands();
  renderTeam();

  // Setup click listeners for main buttons to avoid inline HTML scoping issues
  const btnVerCarros = document.getElementById('btnVerCarros');
  if (btnVerCarros) {
    btnVerCarros.addEventListener('click', mostrarCarros);
  }

  const btnComparar = document.getElementById('btnComparar');
  if (btnComparar) {
    btnComparar.addEventListener('click', mostrarComparativo);
  }

  // Reset button in comparativo section
  const btnReset = document.querySelector('#comparativo .btn-outline');
  if (btnReset) {
    btnReset.addEventListener('click', resetar);
  }
});

// ============================================================
// MARCAS
// ============================================================
function renderBrands() {
  const grid = document.getElementById('brandsGrid');
  if (!grid) return;

  grid.innerHTML = MARCAS.map(m => `
    <div class="brand-card" id="brand-${m.id}" data-id="${m.id}">
      <span class="brand-check">✓</span>
      <div class="brand-logo-wrap">
        <img src="logos/${m.id}.png" alt="${m.nome}" 
          onerror="this.onerror=null; this.src='logos/${m.id}.jpg'; this.addEventListener('error', () => { this.onerror=null; this.src='logos/${m.id}.jpeg'; this.addEventListener('error', () => { this.onerror=null; this.src='${m.logo}'; this.style.display='block'; this.addEventListener('error', () => { this.style.display='none'; }) }) })" />
      </div>
      <span class="brand-name">${m.nome}</span>
    </div>
  `).join('');

  // Attach event listeners programmatically to bypass global/module scoping limits
  grid.querySelectorAll('.brand-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      toggleMarca(id);
    });
  });
}

function toggleMarca(id) {
  const card = document.getElementById(`brand-${id}`);
  if (!card) return;

  if (marcasSelecionadas.has(id)) {
    marcasSelecionadas.delete(id);
    card.classList.remove('selected');
  } else {
    marcasSelecionadas.add(id);
    card.classList.add('selected');
  }
}

// ============================================================
// VEÍCULOS
// ============================================================
function mostrarCarros() {
  if (marcasSelecionadas.size === 0) {
    alert('Selecione pelo menos uma marca!');
    return;
  }

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
}

function renderCars() {
  const grid = document.getElementById('carsGrid');
  if (!grid) return;

  if (carrosFiltrados.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--white-dim); padding: 2rem 0;">Nenhum veículo disponível para as marcas selecionadas.</p>`;
    atualizarBotaoComparar();
    return;
  }

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
      <div class="car-card ${isSelected ? 'selected' : ''}" id="car-${c.id}" data-id="${c.id}">
        <div class="car-img-wrap" style="background: var(--gray-dark); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
          <span class="car-badge">${c.categoria}</span>
          <div class="car-sel-badge">✓</div>
          ${marca ? `
            <img src="logos/${marca.id}.png" alt="${marca.nome}" style="max-height: 65px; width: auto; height: auto; object-fit: contain;"
              onerror="this.onerror=null; this.src='logos/${marca.id}.jpg'; this.addEventListener('error', () => { this.onerror=null; this.src='logos/${marca.id}.jpeg'; this.addEventListener('error', () => { this.onerror=null; this.src='${fallbackUrl}'; this.addEventListener('error', () => { this.style.display='none'; this.nextElementSibling.style.display='flex'; }) }) })" />
            <div class="car-emoji-placeholder" style="display:none;align-items:center;justify-content:center;height:100%;opacity:0.4;font-size:2.5rem">🚗</div>
          ` : `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;opacity:0.4;font-size:2.5rem">🚗</div>
          `}
        </div>
        <div class="car-info">
          <div class="car-brand-tag">${marca?.nome ?? c.marca}</div>
          <h3>${c.nome}</h3>
          <div class="car-cat">${c.ano} · ${c.consumo > 0 ? c.consumo.toFixed(1) + ' km/l' : '⚡ Elétrico'}</div>
          <div class="car-price">${precoFmt}</div>
        </div>
      </div>
    `;
  }).join('');

  // Attach event listeners programmatically to bypass scoping limits
  grid.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      toggleCarro(id);
    });
  });

  atualizarBotaoComparar();
}

function toggleCarro(id) {
  const card = document.getElementById(`car-${id}`);
  if (!card) return;

  const idx  = carrosSelecionados.indexOf(id);

  if (idx >= 0) {
    carrosSelecionados.splice(idx, 1);
    card.classList.remove('selected');
  } else {
    if (carrosSelecionados.length >= 3) {
      // Show error micro-animation or reject selection
      card.classList.add('disabled');
      setTimeout(() => card.classList.remove('disabled'), 600);
      return;
    }
    carrosSelecionados.push(id);
    card.classList.add('selected');
  }
  atualizarBotaoComparar();
}

function atualizarBotaoComparar() {
  const n = carrosSelecionados.length;
  const selCountEl = document.getElementById('selCount');
  if (selCountEl) {
    selCountEl.textContent = `${n}/3 selecionados`;
  }

  const btnComparar = document.getElementById('btnComparar');
  if (btnComparar) {
    btnComparar.disabled = n !== 3;
  }

  // Lock non-selected cards if 3 are already selected
  carrosFiltrados.forEach(c => {
    const card = document.getElementById(`car-${c.id}`);
    if (!card) return;
    if (n >= 3 && !carrosSelecionados.includes(c.id)) {
      card.classList.add('disabled');
    } else {
      card.classList.remove('disabled');
    }
  });
}

// ============================================================
// COMPARATIVO
// ============================================================
function mostrarComparativo() {
  if (carrosSelecionados.length !== 3) return;

  const carros  = carrosSelecionados.map(id => CARROS.find(c => c.id === id));
  const scores  = carros.map(c => calcScore(c, carros));
  const maxScore = Math.max(...scores.map(s => s.total));

  renderCompareCards(carros, scores, maxScore);
  renderCompareTable(carros, scores);

  const section = document.getElementById('comparativo');
  if (section) {
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Animate general score bars after render
  setTimeout(() => {
    carros.forEach((_, i) => {
      const bar = document.getElementById(`bar-${i}`);
      if (bar) bar.style.width = `${(scores[i].total / 10) * 100}%`;
    });
  }, 200);
}

function renderCompareCards(carros, scores, maxScore) {
  const wrap = document.getElementById('compareCards');
  if (!wrap) return;

  wrap.innerHTML = carros.map((c, i) => {
    const score  = scores[i];
    const isWinner = score.total === maxScore;
    const marca  = MARCAS.find(m => m.id === c.marca);
    const precoFmt = c.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    const fallbackUrl = marca ? marca.logo : '';

    return `
      <div class="comp-card ${isWinner ? 'winner' : ''}">
        ${isWinner ? '<span class="winner-badge">🏆 Melhor custo-benefício</span>' : ''}
        <div class="comp-car-img" style="background: var(--gray-dark); display: flex; align-items: center; justify-content: center; height: 160px; padding: 1.25rem;">
          ${marca ? `
            <img src="logos/${marca.id}.png" alt="${marca.nome}" style="max-height: 90px; width: auto; height: auto; object-fit: contain;"
              onerror="this.onerror=null; this.src='logos/${marca.id}.jpg'; this.addEventListener('error', () => { this.onerror=null; this.src='logos/${marca.id}.jpeg'; this.addEventListener('error', () => { this.onerror=null; this.src='${fallbackUrl}'; this.addEventListener('error', () => { this.style.display='none'; this.nextElementSibling.style.display='flex'; }) }) })" />
            <div class="car-emoji-placeholder" style="display:none;align-items:center;justify-content:center;height:100%;opacity:0.4;font-size:3rem">🚗</div>
          ` : `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;opacity:0.4;font-size:3rem">🚗</div>
          `}
        </div>
        <div class="comp-card-body">
          <div class="comp-car-brand">${marca?.nome ?? c.marca}</div>
          <div class="comp-car-name">${c.nome}</div>
          <div style="font-size:0.88rem;color:var(--white-dim);margin-bottom:0.75rem">${c.categoria} · ${c.ano} · ${precoFmt}</div>

          <div class="score-block">
            <div class="score-label">Pontuação geral</div>
            <div class="score-big">${score.total.toFixed(1)}<span>/10</span></div>
            <div class="score-bar-wrap">
              <div class="score-bar" id="bar-${i}"></div>
            </div>
          </div>

          <div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
            ${miniScore('Preço',        score.preco)}
            ${miniScore('Consumo',      score.consumo)}
            ${miniScore('Manutenção',   score.manutencao)}
            ${miniScore('Desvalorização', score.desvalorizacao)}
            ${miniScore('Segurança',    score.seguranca)}
            ${miniScore('Espaço',       score.portamalas)}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function miniScore(label, val) {
  const color = val >= 7 ? '#4ade80' : val >= 4 ? '#facc15' : '#f87171';
  return `
    <div style="background:var(--white-ghost);border-radius:6px;padding:0.4rem 0.6rem">
      <div style="font-size:0.65rem;color:var(--white-dim);margin-bottom:0.15rem">${label}</div>
      <div style="font-size:0.88rem;font-weight:700;color:${color}">${val.toFixed(1)}</div>
    </div>
  `;
}

function tagClass(field, val) {
  const clean = normalizeText(val);
  if (field === 'manutencao') {
    if (clean === "acessivel" || clean === "baixa") return 'tag-acessivel';
    if (clean === "media" || clean === "medio") return 'tag-media';
    return 'tag-cara';
  }
  if (field === 'desvalorizacao') {
    if (clean === "baixa") return 'tag-baixa';
    if (clean === "media" || clean === "medio") return 'tag-media';
    return 'tag-alta';
  }
  if (field === 'seguranca') {
    if (clean === "excelente") return 'tag-excelente';
    if (clean === "boa" || clean === "bom") return 'tag-boa';
    if (clean === "regular") return 'tag-regular';
    return 'tag-pessima';
  }
  return '';
}

function renderCompareTable(carros, scores) {
  const table = document.getElementById('compareTable');
  if (!table) return;

  const marcas = carros.map(c => MARCAS.find(m => m.id === c.marca));

  const rows = [
    { label: 'Marca',        vals: carros.map((c,i) => marcas[i]?.nome ?? c.marca) },
    { label: 'Categoria',    vals: carros.map(c => c.categoria) },
    { label: 'Ano',          vals: carros.map(c => c.ano) },
    { label: 'Preço médio',  vals: carros.map(c => c.preco.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})) },
    { label: 'Consumo',      vals: carros.map(c => c.consumo > 0 ? `${c.consumo.toFixed(1)} km/l` : '⚡ Elétrico') },
    { label: 'Potência',     vals: carros.map(c => `${c.potencia} cv`) },
    { label: 'Porta-malas',  vals: carros.map(c => `${c.portamalas} L`) },
    { label: 'Manutenção',   vals: carros.map(c => c.manutencao),   field:'manutencao' },
    { label: 'Desvalorização',vals: carros.map(c => c.desvalorizacao),field:'desvalorizacao' },
    { label: 'Segurança',    vals: carros.map(c => c.seguranca),    field:'seguranca' },
    { label: 'Pontuação',    vals: scores.map(s => s.total.toFixed(2) + '/10'), highlight: true },
  ];

  const bestScore = Math.max(...scores.map(s => s.total));

  table.innerHTML = `
    <thead>
      <tr>
        <th>Critério</th>
        ${carros.map(c => `<th class="car-col">${c.nome}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(row => `
        <tr>
          <td class="row-label">${row.label}</td>
          ${row.vals.map((v, i) => {
            const cls = row.field ? tagClass(row.field, v) : '';
            const isHigh = row.highlight && scores[i].total === bestScore;
            return `<td class="${cls}${isHigh ? ' highlight' : ''}">${v}</td>`;
          }).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;
}

// ============================================================
// EQUIPE
// ============================================================
const EQUIPE = [
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
  `).join('');
}

// ============================================================
// RESET
// ============================================================
function resetar() {
  marcasSelecionadas.clear();
  carrosSelecionados = [];
  carrosFiltrados    = [];

  document.querySelectorAll('.brand-card').forEach(c => c.classList.remove('selected'));
  
  const sectionVeiculos = document.getElementById('veiculos');
  if (sectionVeiculos) sectionVeiculos.classList.add('hidden');

  const sectionComparativo = document.getElementById('comparativo');
  if (sectionComparativo) sectionComparativo.classList.add('hidden');

  const marcasSection = document.getElementById('marcas');
  if (marcasSection) {
    marcasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Expose main functions to global scope as a fallback for inline HTML handlers
window.toggleMarca = toggleMarca;
window.mostrarCarros = mostrarCarros;
window.toggleCarro = toggleCarro;
window.mostrarComparativo = mostrarComparativo;
window.resetar = resetar;
