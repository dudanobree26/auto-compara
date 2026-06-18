cat > /mnt/user-data/outputs/data.js << 'EOF'
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

// Preenchido via planilha; se falhar, fica vazio e o site avisa o usuário
let CARROS = [];

async function carregarPlanilha() {
  const URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfJg8Zq8CHvHtv15QZ252Ydvey0aiXt6h7mbxLthgneWB-oMPEiVl9x5Pp-zbzRZA2RHqgX36z9Py2/pub?gid=1782389322&single=true&output=csv";

  try {
    const res = await fetch(URL);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const texto  = await res.text();
    const linhas = texto.trim().split("\n").slice(1); // pula cabeçalho

    const parsed = linhas
      .map(linha => {
        // suporta células com vírgula entre aspas (CSV básico)
        const c = linha.split(",");
        return {
          id:             c[0]?.trim().toLowerCase().replace(/\s+/g, "_"),
          marca:          c[1]?.trim().toLowerCase(),
          nome:           c[2]?.trim(),
          categoria:      c[3]?.trim(),
          ano:            Number(c[4]),
          preco:          Number(c[5]),
          consumo:        Number(c[6]),
          potencia:       Number(c[7]),
          portamalas:     Number(c[8]),
          manutencao:     c[9]?.trim().toLowerCase(),
          desvalorizacao: c[10]?.trim().toLowerCase(),
          seguranca:      c[11]?.trim().toLowerCase(),
          img: "",
        };
      })
      .filter(c => c.nome && c.id); // descarta linhas inválidas

    if (parsed.length === 0) throw new Error("Planilha retornou 0 registros");

    CARROS = parsed;
    console.info(`[AutoCompara] ${CARROS.length} veículos carregados.`);

  } catch (err) {
    console.error("[AutoCompara] Falha ao carregar planilha:", err);
    // Mostra aviso amigável na tela (sem quebrar o resto do site)
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
function scoreManutencao(v)     { return { acessivel: 10, media: 6, cara: 2 }[v]           ?? 5; }
function scoreDesvalorizacao(v) { return { baixa: 10,    media: 6, alta: 2 }[v]             ?? 5; }
function scoreSeguranca(v)      { return { excelente: 10, boa: 7, regular: 4, pessima: 1 }[v] ?? 5; }

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
EOF
echo "data.js criado"
