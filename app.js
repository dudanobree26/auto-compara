// ============================================================
// AUTOCOMPARA — Lógica principal
// ============================================================

let marcasSelecionadas = new Set();
let carrosSelecionados = [];
let carrosFiltrados    = [];

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderBrands();
  renderTeam();
});

// ============================================================
// MARCAS
// ============================================================
function renderBrands() {
  const grid = document.getElementById('brandsGrid');
  grid.innerHTML = MARCAS.map(m => `
    <div class="brand-card" id="brand-${m.id}" onclick="toggleMarca('${m.id}')">
      <span class="brand-check">✓</span>
      <div class="brand-logo-wrap">
        <img src="${m.logo}" alt="${m.nome}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22><rect width=%2264%22 height=%2264%22 rx=%228%22 fill=%22%230057FF%22 opacity=%220.2%22/><text x=%2232%22 y=%2240%22 text-anchor=%22middle%22 fill=%22%234DA6FF%22 font-size=%2214%22 font-weight=%22bold%22 font-family=%22Arial%22>${m.nome[0]}</text></svg>'" />
      </div>
      <span class="brand-name">${m.nome}</span>
    </div>
  `).join('');
}

function toggleMarca(id) {
  const card = document.getElementById(`brand-${id}`);
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

  const section = document.getElementById('veiculos');
  section.classList.remove('hidden');
  renderCars();
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderCars() {
  const grid = document.getElementById('carsGrid');
  grid.innerHTML = carrosFiltrados.map(c => {
    const marca = MARCAS.find(m => m.id === c.marca);
    const precoFmt = c.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    return `
      <div class="car-card" id="car-${c.id}" onclick="toggleCarro('${c.id}')">
        <div class="car-img-wrap">
          <span class="car-badge">${c.categoria}</span>
          <div class="car-sel-badge">✓</div>
          <img src="${c.img}" alt="${c.nome}"
            onerror="this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;opacity:0.4;font-size:2.5rem\'>🚗</div>'" />
        </div>
        <div class="car-info">
          <div class="car-brand-tag">${marca?.nome ?? c.marca}</div>
          <h3>${c.nome}</h3>
          <div class="car-cat">${c.ano} · ${c.consumo > 0 ? c.consumo + ' km/l' : '⚡ Elétrico'}</div>
          <div class="car-price">${precoFmt}</div>
        </div>
      </div>
    `;
  }).join('');
  atualizarBotaoComparar();
}

function toggleCarro(id) {
  const card = document.getElementById(`car-${id}`);
  const idx  = carrosSelecionados.indexOf(id);

  if (idx >= 0) {
    carrosSelecionados.splice(idx, 1);
    card.classList.remove('selected');
  } else {
    if (carrosSelecionados.length >= 3) {
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
  document.getElementById('selCount').textContent = `${n}/3 selecionados`;
  document.getElementById('btnComparar').disabled = n !== 3;

  // Bloquear cards não selecionados se 3 já escolhidos
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
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Animar barras depois de render
  setTimeout(() => {
    carros.forEach((_, i) => {
      const bar = document.getElementById(`bar-${i}`);
      if (bar) bar.style.width = `${(scores[i].total / 10) * 100}%`;
    });
  }, 200);
}

function renderCompareCards(carros, scores, maxScore) {
  const wrap = document.getElementById('compareCards');
  wrap.innerHTML = carros.map((c, i) => {
    const score  = scores[i];
    const isWinner = score.total === maxScore;
    const marca  = MARCAS.find(m => m.id === c.marca);
    const precoFmt = c.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

    return `
      <div class="comp-card ${isWinner ? 'winner' : ''}">
        ${isWinner ? '<span class="winner-badge">🏆 Melhor custo-benefício</span>' : ''}
        <div class="comp-car-img">
          <img src="${c.img}" alt="${c.nome}"
            onerror="this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;opacity:0.4;font-size:3rem\'>🚗</div>'" />
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
  if (field === 'manutencao')     return `tag-${val}`;
  if (field === 'desvalorizacao') return `tag-${val}`;
  if (field === 'seguranca')      return `tag-${val}`;
  return '';
}

function renderCompareTable(carros, scores) {
  const table = document.getElementById('compareTable');
  const marcas = carros.map(c => MARCAS.find(m => m.id === c.marca));

  const rows = [
    { label: 'Marca',        vals: carros.map((c,i) => marcas[i]?.nome ?? c.marca) },
    { label: 'Categoria',    vals: carros.map(c => c.categoria) },
    { label: 'Ano',          vals: carros.map(c => c.ano) },
    { label: 'Preço médio',  vals: carros.map(c => c.preco.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})) },
    { label: 'Consumo',      vals: carros.map(c => c.consumo > 0 ? `${c.consumo} km/l` : '⚡ Elétrico') },
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
  { nome: "Eduarda Nobre",    iniciais: "EN", foto: null },
  { nome: "Thaís Domingues",  iniciais: "TD", foto: null },
  { nome: "William Bertolotto",iniciais:"WB", foto: null },
  { nome: "Diana Soares",     iniciais: "DS", foto: null },
  { nome: "Tainara Sales",    iniciais: "TS", foto: null },
];

function renderTeam() {
  const grid = document.getElementById('teamGrid');
  grid.innerHTML = EQUIPE.map(p => `
    <div class="team-card">
      <div class="team-avatar" id="avatar-${p.iniciais}">
        ${p.foto
          ? `<img src="${p.foto}" alt="${p.nome}" />`
          : p.iniciais
        }
      </div>
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
  document.getElementById('veiculos').classList.add('hidden');
  document.getElementById('comparativo').classList.add('hidden');

  document.getElementById('marcas').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
