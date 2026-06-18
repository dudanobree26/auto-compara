// ============================================================
// AUTOCOMPARA — Base de Dados de Veículos
// ⚠️ Dados estimados — podem conter inconsistências
// Fontes: Webmotors, Tabela FIPE, Salão do Automóvel, relatórios do setor
// ============================================================
const MARCAS = [
  { id: "chevrolet", nome: "Chevrolet", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Chevrolet_logo_gold.svg/200px-Chevrolet_logo_gold.svg.png" },
  { id: "hyundai",   nome: "Hyundai",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Hyundai_Motor_Company_logo.svg/200px-Hyundai_Motor_Company_logo.svg.png" },
  { id: "fiat",      nome: "Fiat",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/FIAT_wordmark.svg/200px-FIAT_wordmark.svg.png" },
  { id: "vw",        nome: "VW",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/200px-Volkswagen_logo_2019.svg.png" },
  { id: "ford",      nome: "Ford",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_Motor_Company_Logo.svg/200px-Ford_Motor_Company_Logo.svg.png" },
  { id: "jeep",      nome: "Jeep",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Jeep_wordmark.svg/200px-Jeep_wordmark.svg.png" },
  { id: "renault",   nome: "Renault",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Renault_2021_Text.svg/200px-Renault_2021_Text.svg.png" },
  { id: "toyota",    nome: "Toyota",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/200px-Toyota_carlogo.svg.png" },
  { id: "nissan",    nome: "Nissan",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Nissan_2020_logo.svg/200px-Nissan_2020_logo.svg.png" },
  { id: "honda",     nome: "Honda",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/200px-Honda.svg.png" },
  { id: "citroen",   nome: "Citroën",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Citro%C3%ABn_logo_%282009%29.svg/200px-Citro%C3%ABn_logo_%282009%29.svg.png" },
  { id: "mitsubishi",nome: "Mitsubishi",logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Mitsubishi_logo.svg/200px-Mitsubishi_logo.svg.png" },
  { id: "caoa",      nome: "CAOA",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/CAOA_Chery_logo.png/200px-CAOA_Chery_logo.png" },
  { id: "peugeot",   nome: "Peugeot",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Peugeot_logo_2021.svg/200px-Peugeot_logo_2021.svg.png" },
  { id: "gwm",       nome: "GWM",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Great_Wall_Motors_Logo.svg/200px-Great_Wall_Motors_Logo.svg.png" },
  { id: "ram",       nome: "RAM",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/RAM_Trucks_logo.svg/200px-RAM_Trucks_logo.svg.png" },
  { id: "byd",       nome: "BYD",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/BYD_Auto_logo.svg/200px-BYD_Auto_logo.svg.png" },
];
let CARROS = [];
// Helper functions for CSV and string processing
function parseCSVLine(line) {
  let fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    let char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}
function normalizeText(str) {
  if (!str) return "";
  return str.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // removes accents/diacritics
}
function normalizeMarca(str) {
  if (!str) return "";
  let clean = str.trim().toLowerCase();
  if (clean.includes("citro")) return "citroen";
  return clean.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function parsePreco(str) {
  if (!str) return 0;
  // Clean up dashes and spaces
  let clean = str.replace(/â€“/g, '-').replace(/–/g, '-').replace(/\s+/g, '');
  let match = clean.match(/(\d+)(?:-(\d+))?mil/i);
  if (match) {
    let min = Number(match[1]);
    let max = match[2] ? Number(match[2]) : min;
    return ((min + max) / 2) * 1000;
  }
  let numMatch = clean.match(/\d+/);
  return numMatch ? Number(numMatch[0]) * 1000 : 0;
}
function parseConsumo(str) {
  if (!str) return 0;
  let clean = str.replace(/â€“/g, '-').replace(/–/g, '-').replace(/,/g, '.').replace(/\s+/g, '');
  let matches = clean.match(/(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?/g);
  if (matches) {
    let sum = 0;
    let count = 0;
    for (let m of matches) {
      let rangeMatch = m.match(/(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?/);
      if (rangeMatch) {
        let min = Number(rangeMatch[1]);
        let max = rangeMatch[2] ? Number(rangeMatch[2]) : min;
        sum += (min + max) / 2;
        count++;
      }
    }
    if (count > 0) return sum / count;
  }
  return 0;
}
function parsePotencia(str) {
  if (!str) return 0;
  let clean = str.replace(/â€“/g, '-').replace(/–/g, '-').replace(/\s+/g, '');
  let match = clean.match(/(\d+)(?:-(\d+))?/);
  if (match) {
    let min = Number(match[1]);
    let max = match[2] ? Number(match[2]) : min;
    return (min + max) / 2;
  }
  return 0;
}
function parsePortamalas(str) {
  if (!str) return 0;
  let clean = str.replace(/\./g, '').replace(/\s+/g, '');
  let match = clean.match(/\d+/);
  return match ? Number(match[0]) : 0;
}
async function carregarPlanilha() {
  const URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfJg8Zq8CHvHtv15QZ252Ydvey0aiXt6h7mbxLthgneWB-oMPEiVl9x5Pp-zbzRZA2RHqgX36z9Py2/pub?gid=1782389322&single=true&output=csv";
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const texto  = await res.text();
    // Normalize lines to avoid carriage return problems (\r)
    const linhas = texto.replace(/\r/g, "").trim().split("\n").slice(1); // pula cabeçalho
    const parsed = linhas
      .map(linha => {
        const c = parseCSVLine(linha);
        if (c.length < 11) return null;
        const marcaNorm = normalizeMarca(c[0]);
        const nomeVeiculo = c[1]?.trim();
        
        // Generate unique vehicle ID
        const veiculoClean = nomeVeiculo.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        const id = `${marcaNorm}_${veiculoClean}`;
        return {
          id:             id,
          marca:          marcaNorm,
          nome:           nomeVeiculo,
          categoria:      c[2]?.trim(),
          ano:            Number(c[3]) || 2024,
          preco:          parsePreco(c[4]),
          consumo:        parseConsumo(c[5]),
          potencia:       parsePotencia(c[6]),
          portamalas:     parsePortamalas(c[7]),
          manutencao:     c[8]?.trim(),
          desvalorizacao: c[9]?.trim(),
          seguranca:      c[10]?.trim(),
          img: "",
        };
      })
      .filter(c => c && c.nome && c.id);
    if (parsed.length === 0) throw new Error("Planilha retornou 0 registros");
    CARROS = parsed;
    console.info(`[AutoCompara] ${CARROS.length} veículos carregados.`);
  } catch (err) {
    console.error("[AutoCompara] Falha ao carregar planilha:", err);
    const grid = document.getElementById('brandsGrid');
    if (grid) {
      const aviso = document.createElement('p');
      aviso.style.cssText =
        "grid-column:1/-1;color:#f87171;font-size:.9rem;padding:.5rem 0";
      aviso.textContent =
        "⚠️ Não foi possível carregar os dados dos veículos. Verifique sua conexão ou tente novamente mais tarde.";
      grid.after(aviso);
    }
  }
}
// ============================================================
// Pesos dos critérios
// ============================================================
const PESOS = {
  preco:          0.25,
  consumo:        0.20,
  manutencao:     0.20,
  desvalorizacao: 0.20,
  seguranca:      0.10,
  portamalas:     0.05,
};
// ============================================================
// Conversão de strings → scores numéricos (0–10)
// ============================================================
function scoreManutencao(v) {
  const clean = normalizeText(v);
  if (clean === "acessivel" || clean === "baixa") return 10;
  if (clean === "media" || clean === "medio") return 6;
  if (clean === "cara" || clean === "alta") return 2;
  return 5;
}
function scoreDesvalorizacao(v) {
  const clean = normalizeText(v);
  if (clean === "baixa") return 10;
  if (clean === "media" || clean === "medio") return 6;
  if (clean === "alta") return 2;
  return 5;
}
function scoreSeguranca(v) {
  const clean = normalizeText(v);
  if (clean === "excelente") return 10;
  if (clean === "boa" || clean === "bom") return 7;
  if (clean === "regular") return 4;
  if (clean === "pessima" || clean === "ruim") return 1;
  return 5;
}
function calcScore(carro, todos) {
  const precos   = todos.map(c => c.preco);
  const consumos = todos.map(c => c.consumo > 0 ? c.consumo : 15);
  const pts      = todos.map(c => c.portamalas);
  const norm    = (v, min, max) => max === min ? 5 : ((v - min)   / (max - min)) * 10;
  const normInv = (v, min, max) => max === min ? 5 : ((max - v)   / (max - min)) * 10;
  const minPreco = Math.min(...precos),  maxPreco = Math.max(...precos);
  const minCons  = Math.min(...consumos), maxCons = Math.max(...consumos);
  const minPt    = Math.min(...pts),      maxPt   = Math.max(...pts);
  const consumoVal = carro.consumo > 0 ? carro.consumo : 18;
  const s = {
    preco:          normInv(carro.preco,    minPreco, maxPreco),
    consumo:        norm(consumoVal,         minCons,  maxCons),
    manutencao:     scoreManutencao(carro.manutencao),
    desvalorizacao: scoreDesvalorizacao(carro.desvalorizacao),
    seguranca:      scoreSeguranca(carro.seguranca),
    portamalas:     norm(carro.portamalas,  minPt,    maxPt),
  };
  const total =
    s.preco          * PESOS.preco          +
    s.consumo        * PESOS.consumo        +
    s.manutencao     * PESOS.manutencao     +
    s.desvalorizacao * PESOS.desvalorizacao +
    s.seguranca      * PESOS.seguranca      +
    s.portamalas     * PESOS.portamalas;
  return { ...s, total };
}
