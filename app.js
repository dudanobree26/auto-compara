// Adicionado no topo do arquivo junto com as outras variáveis globais:
let categoriaSelecionada = "Todos";

// Funções auxiliares adicionadas:
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

// Atualização da função mostrarCarros():
function mostrarCarros() {
  if (marcasSelecionadas.size === 0) {
    alert('Selecione pelo menos uma marca!');
    return;
  }

  carrosSelecionados = [];
  carrosFiltrados = CARROS.filter(c => marcasSelecionadas.has(c.marca));
  categoriaSelecionada = "Todos"; // Reseta o filtro ao trocar de marcas

  const section = document.getElementById('veiculos');
  if (section) {
    section.classList.remove('hidden');
    renderCategoryFilters(); // Renderiza os filtros na tela
    renderCars();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Atualização da função renderCars():
function renderCars() {
  const grid = document.getElementById('carsGrid');
  if (!grid) return;

  if (carrosFiltrados.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--white-dim); padding: 2rem 0;">Nenhum veículo disponível para as marcas selecionadas.</p>`;
    atualizarBotaoComparar();
    return;
  }

  // Filtragem dos carros pela categoria selecionada
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

  // Atribui os cliques nos cards de forma dinâmica
  grid.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      toggleCarro(id);
    });
  });

  atualizarBotaoComparar();
}

// Atualização da lista EQUIPE e função renderTeam():
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
