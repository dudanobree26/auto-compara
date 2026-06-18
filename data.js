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

// Dados de 50 veículos (mais vendidos 2020–2025, estimativas)
// Campos: manutenção: acessivel|media|cara | desvalorizacao: baixa|media|alta | seguranca: excelente|boa|regular|pessima
const CARROS = [
  // CHEVROLET
  { id:"onix",       marca:"chevrolet", nome:"Onix",           categoria:"Hatch",          ano:2024, preco:82990,  consumo:14.5, potencia:101, portamalas:222, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"boa",       img:"https://www.chevrolet.com.br/content/dam/chevrolet/south-america/brazil/portuguese/index/cars/2024-onix/colorizer/01_images/2024-chevrolet-onix-01.png" },
  { id:"onix_plus",  marca:"chevrolet", nome:"Onix Plus",      categoria:"Sedan",          ano:2024, preco:92990,  consumo:14.2, potencia:101, portamalas:282, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"boa",       img:"https://www.chevrolet.com.br/content/dam/chevrolet/south-america/brazil/portuguese/index/cars/2024-onix-plus/colorizer/01_images/2024-chevrolet-onix-plus-01.png" },
  { id:"tracker",    marca:"chevrolet", nome:"Tracker",        categoria:"SUV Compacto",   ano:2024, preco:127990, consumo:12.8, potencia:133, portamalas:393, manutencao:"media",    desvalorizacao:"media",  seguranca:"excelente", img:"https://www.chevrolet.com.br/content/dam/chevrolet/south-america/brazil/portuguese/index/cars/2024-tracker/colorizer/01_images/2024-chevrolet-tracker-01.png" },
  { id:"equinox",    marca:"chevrolet", nome:"Equinox EV",     categoria:"SUV Médio",      ano:2025, preco:259990, consumo:0,    potencia:288, portamalas:748, manutencao:"cara",     desvalorizacao:"media",  seguranca:"excelente", img:"https://www.chevrolet.com.br/content/dam/chevrolet/south-america/brazil/portuguese/index/cars/2024-equinox-ev/colorizer/01_images/2024-chevrolet-equinox-ev-01.png" },
  { id:"montana",    marca:"chevrolet", nome:"Montana",        categoria:"Picape Compacta",ano:2023, preco:119990, consumo:12.0, potencia:133, portamalas:734, manutencao:"acessivel", desvalorizacao:"baixa", seguranca:"boa",       img:"https://www.chevrolet.com.br/content/dam/chevrolet/south-america/brazil/portuguese/index/cars/2023-montana/colorizer/01_images/2023-chevrolet-montana-01.png" },

  // HYUNDAI
  { id:"hb20",       marca:"hyundai",   nome:"HB20",           categoria:"Hatch",          ano:2024, preco:79990,  consumo:13.8, potencia:99,  portamalas:300, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"boa",       img:"https://www.hyundai.com.br/content/dam/hyundai/br/models/hb20/gallery/hb20-gallery-1.jpg" },
  { id:"hb20s",      marca:"hyundai",   nome:"HB20S",          categoria:"Sedan",          ano:2024, preco:87990,  consumo:13.5, potencia:99,  portamalas:450, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"boa",       img:"https://www.hyundai.com.br/content/dam/hyundai/br/models/hb20s/gallery/hb20s-gallery-1.jpg" },
  { id:"creta",      marca:"hyundai",   nome:"Creta",          categoria:"SUV Compacto",   ano:2024, preco:144990, consumo:11.5, potencia:167, portamalas:422, manutencao:"media",    desvalorizacao:"baixa",  seguranca:"excelente", img:"https://www.hyundai.com.br/content/dam/hyundai/br/models/creta/gallery/creta-gallery-1.jpg" },
  { id:"tucson",     marca:"hyundai",   nome:"Tucson",         categoria:"SUV Médio",      ano:2024, preco:199990, consumo:11.0, potencia:178, portamalas:539, manutencao:"media",    desvalorizacao:"media",  seguranca:"excelente", img:"https://www.hyundai.com.br/content/dam/hyundai/br/models/tucson/gallery/tucson-gallery-1.jpg" },
  { id:"ix35",       marca:"hyundai",   nome:"ix35",           categoria:"SUV Compacto",   ano:2023, preco:169990, consumo:11.2, potencia:167, portamalas:591, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://www.hyundai.com.br/content/dam/hyundai/br/models/ix35/gallery/ix35-gallery-1.jpg" },

  // FIAT
  { id:"argo",       marca:"fiat",      nome:"Argo",           categoria:"Hatch",          ano:2024, preco:81990,  consumo:13.0, potencia:109, portamalas:300, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"boa",       img:"https://www.fiat.com.br/content/dam/fiat/south-america/brazil/portuguese/models/argo/gallery/2023-fiat-argo-01.png" },
  { id:"cronos",     marca:"fiat",      nome:"Cronos",         categoria:"Sedan",          ano:2024, preco:88990,  consumo:13.5, potencia:109, portamalas:500, manutencao:"acessivel", desvalorizacao:"alta",   seguranca:"regular",   img:"https://www.fiat.com.br/content/dam/fiat/south-america/brazil/portuguese/models/cronos/gallery/2023-fiat-cronos-01.png" },
  { id:"pulse",      marca:"fiat",      nome:"Pulse",          categoria:"SUV Compacto",   ano:2024, preco:109990, consumo:12.5, potencia:130, portamalas:370, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://www.fiat.com.br/content/dam/fiat/south-america/brazil/portuguese/models/pulse/gallery/2024-fiat-pulse-01.png" },
  { id:"fastback",   marca:"fiat",      nome:"Fastback",       categoria:"SUV Cupê",       ano:2024, preco:134990, consumo:11.8, potencia:185, portamalas:516, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://www.fiat.com.br/content/dam/fiat/south-america/brazil/portuguese/models/fastback/gallery/2024-fiat-fastback-01.png" },
  { id:"strada",     marca:"fiat",      nome:"Strada",         categoria:"Picape Compacta",ano:2024, preco:102990, consumo:12.0, potencia:130, portamalas:714, manutencao:"acessivel", desvalorizacao:"baixa", seguranca:"boa",       img:"https://www.fiat.com.br/content/dam/fiat/south-america/brazil/portuguese/models/strada/gallery/2024-fiat-strada-01.png" },

  // VOLKSWAGEN
  { id:"polo",       marca:"vw",        nome:"Polo",           categoria:"Hatch",          ano:2024, preco:99990,  consumo:13.0, potencia:128, portamalas:300, manutencao:"media",    desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/8ANQM/s3/volkswagen-polo-2024.jpg" },
  { id:"virtus",     marca:"vw",        nome:"Virtus",         categoria:"Sedan",          ano:2024, preco:105990, consumo:12.8, potencia:128, portamalas:521, manutencao:"media",    desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/e8Vkb/s3/vw-virtus-2024.jpg" },
  { id:"t_cross",    marca:"vw",        nome:"T-Cross",        categoria:"SUV Compacto",   ano:2024, preco:139990, consumo:12.2, potencia:128, portamalas:373, manutencao:"media",    desvalorizacao:"baixa",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/xg6kP/s3/vw-t-cross-2024.jpg" },
  { id:"taos",       marca:"vw",        nome:"Taos",           categoria:"SUV Médio",      ano:2024, preco:184990, consumo:11.5, potencia:150, portamalas:471, manutencao:"media",    desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/mqGE2/s3/vw-taos-2024.jpg" },
  { id:"saveiro",    marca:"vw",        nome:"Saveiro",        categoria:"Picape Compacta",ano:2024, preco:96990,  consumo:12.5, potencia:104, portamalas:680, manutencao:"acessivel", desvalorizacao:"baixa", seguranca:"regular",   img:"https://cdn.motor1.com/images/mgl/o3RPN/s3/vw-saveiro-2024.jpg" },

  // FORD
  { id:"maverick",   marca:"ford",      nome:"Maverick",       categoria:"Picape",         ano:2024, preco:179990, consumo:10.5, potencia:168, portamalas:1057,manutencao:"media",    desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/7xoJj/s3/ford-maverick-2024.jpg" },
  { id:"bronco_s",   marca:"ford",      nome:"Bronco Sport",   categoria:"SUV Compacto",   ano:2024, preco:219990, consumo:11.0, potencia:181, portamalas:680, manutencao:"cara",     desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/m7GAL/s3/ford-bronco-sport-2024.jpg" },
  { id:"territory",  marca:"ford",      nome:"Territory",      categoria:"SUV Médio",      ano:2024, preco:199990, consumo:11.2, potencia:141, portamalas:448, manutencao:"media",    desvalorizacao:"alta",   seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/zBqJ4/s3/ford-territory-2024.jpg" },
  { id:"ranger",     marca:"ford",      nome:"Ranger",         categoria:"Picape Média",   ano:2024, preco:264990, consumo:10.2, potencia:225, portamalas:1389,manutencao:"cara",     desvalorizacao:"baixa",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/wBxeE/s3/ford-ranger-2024.jpg" },

  // JEEP
  { id:"renegade",   marca:"jeep",      nome:"Renegade",       categoria:"SUV Compacto",   ano:2024, preco:149990, consumo:11.5, potencia:185, portamalas:320, manutencao:"media",    desvalorizacao:"alta",   seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/3xkP2/s3/jeep-renegade-2024.jpg" },
  { id:"compass",    marca:"jeep",      nome:"Compass",        categoria:"SUV Médio",      ano:2024, preco:219990, consumo:11.0, potencia:185, portamalas:438, manutencao:"cara",     desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/7xoJj/s3/jeep-compass-2024.jpg" },
  { id:"commander",  marca:"jeep",      nome:"Commander",      categoria:"SUV 7 Lugares",  ano:2024, preco:284990, consumo:10.5, potencia:272, portamalas:617, manutencao:"cara",     desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/9bkGv/s3/jeep-commander-2024.jpg" },
  { id:"gladiator",  marca:"jeep",      nome:"Gladiator",      categoria:"Picape",         ano:2024, preco:389990, consumo:9.5,  potencia:274, portamalas:1147,manutencao:"cara",     desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/zpzW4/s3/jeep-gladiator-2024.jpg" },

  // RENAULT
  { id:"kwid",       marca:"renault",   nome:"Kwid",           categoria:"Hatch",          ano:2024, preco:72990,  consumo:15.0, potencia:66,  portamalas:290, manutencao:"acessivel", desvalorizacao:"alta",  seguranca:"regular",   img:"https://cdn.motor1.com/images/mgl/YGMqW/s3/renault-kwid-2024.jpg" },
  { id:"sandero",    marca:"renault",   nome:"Sandero",        categoria:"Hatch",          ano:2024, preco:85990,  consumo:13.8, potencia:113, portamalas:320, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/nBLPb/s3/renault-sandero-2024.jpg" },
  { id:"kardian",    marca:"renault",   nome:"Kardian",        categoria:"SUV Compacto",   ano:2024, preco:109990, consumo:13.0, potencia:130, portamalas:390, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/JP0pb/s3/renault-kardian-2024.jpg" },
  { id:"duster",     marca:"renault",   nome:"Duster",         categoria:"SUV Compacto",   ano:2024, preco:119990, consumo:12.5, potencia:143, portamalas:475, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/Zp9bN/s3/renault-duster-2024.jpg" },

  // TOYOTA
  { id:"yaris_h",    marca:"toyota",    nome:"Yaris Hatch",    categoria:"Hatch",          ano:2023, preco:114990, consumo:14.5, potencia:108, portamalas:286, manutencao:"acessivel", desvalorizacao:"baixa",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/gBRqv/s3/toyota-yaris-2023.jpg" },
  { id:"corolla",    marca:"toyota",    nome:"Corolla Cross",  categoria:"SUV Compacto",   ano:2024, preco:199990, consumo:14.2, potencia:122, portamalas:487, manutencao:"media",    desvalorizacao:"baixa",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/KAbkx/s3/toyota-corolla-cross-2024.jpg" },
  { id:"hilux",      marca:"toyota",    nome:"Hilux",          categoria:"Picape Média",   ano:2024, preco:299990, consumo:11.0, potencia:204, portamalas:938, manutencao:"media",    desvalorizacao:"baixa",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/wBxeE/s3/toyota-hilux-2024.jpg" },
  { id:"sw4",        marca:"toyota",    nome:"SW4",            categoria:"SUV Grande",     ano:2024, preco:399990, consumo:10.0, potencia:204, portamalas:510, manutencao:"cara",     desvalorizacao:"baixa",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/Zp9bN/s3/toyota-sw4-2024.jpg" },

  // NISSAN
  { id:"kicks",      marca:"nissan",    nome:"Kicks",          categoria:"SUV Compacto",   ano:2024, preco:134990, consumo:14.5, potencia:116, portamalas:432, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/mqGE2/s3/nissan-kicks-2024.jpg" },
  { id:"frontier",   marca:"nissan",    nome:"Frontier",       categoria:"Picape Média",   ano:2024, preco:279990, consumo:10.5, potencia:190, portamalas:900, manutencao:"media",    desvalorizacao:"baixa",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/e8Vkb/s3/nissan-frontier-2024.jpg" },
  { id:"versa",      marca:"nissan",    nome:"Versa",          categoria:"Sedan",          ano:2024, preco:99990,  consumo:13.0, potencia:120, portamalas:490, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/7xoJj/s3/nissan-versa-2024.jpg" },

  // HONDA
  { id:"fit",        marca:"honda",     nome:"Fit",            categoria:"Hatch",          ano:2023, preco:115990, consumo:13.5, potencia:128, portamalas:354, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/xg6kP/s3/honda-fit-2023.jpg" },
  { id:"city",       marca:"honda",     nome:"City",           categoria:"Sedan",          ano:2024, preco:119990, consumo:13.8, potencia:128, portamalas:519, manutencao:"media",    desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/9bkGv/s3/honda-city-2024.jpg" },
  { id:"hrv",        marca:"honda",     nome:"HR-V",           categoria:"SUV Compacto",   ano:2024, preco:154990, consumo:13.0, potencia:128, portamalas:437, manutencao:"media",    desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/8ANQM/s3/honda-hrv-2024.jpg" },
  { id:"crv",        marca:"honda",     nome:"CR-V",           categoria:"SUV Médio",      ano:2024, preco:239990, consumo:12.5, potencia:190, portamalas:589, manutencao:"cara",     desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/o3RPN/s3/honda-crv-2024.jpg" },

  // CITROËN
  { id:"c3",         marca:"citroen",   nome:"C3",             categoria:"Hatch",          ano:2024, preco:84990,  consumo:13.5, potencia:101, portamalas:316, manutencao:"acessivel", desvalorizacao:"media",  seguranca:"regular",   img:"https://cdn.motor1.com/images/mgl/zpzW4/s3/citroen-c3-2024.jpg" },
  { id:"c4",         marca:"citroen",   nome:"C4 Cactus",      categoria:"SUV Compacto",   ano:2024, preco:119990, consumo:12.8, potencia:130, portamalas:385, manutencao:"media",    desvalorizacao:"alta",   seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/YGMqW/s3/citroen-c4-2024.jpg" },

  // MITSUBISHI
  { id:"eclipse_c",  marca:"mitsubishi",nome:"Eclipse Cross",  categoria:"SUV Compacto",   ano:2024, preco:199990, consumo:11.0, potencia:150, portamalas:448, manutencao:"cara",     desvalorizacao:"alta",   seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/nBLPb/s3/mitsubishi-eclipse-cross-2024.jpg" },
  { id:"l200",       marca:"mitsubishi",nome:"L200 Triton",    categoria:"Picape Média",   ano:2024, preco:219990, consumo:10.8, potencia:190, portamalas:890, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/3xkP2/s3/mitsubishi-l200-2024.jpg" },

  // CAOA
  { id:"arrizo6",    marca:"caoa",      nome:"Arrizo 6 Pro",   categoria:"Sedan",          ano:2024, preco:109990, consumo:13.5, potencia:147, portamalas:501, manutencao:"media",    desvalorizacao:"alta",   seguranca:"regular",   img:"https://cdn.motor1.com/images/mgl/JP0pb/s3/caoa-chery-arrizo6-2024.jpg" },
  { id:"tiggo8",     marca:"caoa",      nome:"Tiggo 8 Pro",    categoria:"SUV 7 Lugares",  ano:2024, preco:189990, consumo:11.5, potencia:197, portamalas:193, manutencao:"media",    desvalorizacao:"alta",   seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/gBRqv/s3/caoa-tiggo8-2024.jpg" },

  // PEUGEOT
  { id:"208",        marca:"peugeot",   nome:"208",            categoria:"Hatch",          ano:2024, preco:99990,  consumo:12.5, potencia:130, portamalas:311, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/KAbkx/s3/peugeot-208-2024.jpg" },
  { id:"2008",       marca:"peugeot",   nome:"2008",           categoria:"SUV Compacto",   ano:2024, preco:144990, consumo:12.0, potencia:130, portamalas:434, manutencao:"media",    desvalorizacao:"media",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/wBxeE/s3/peugeot-2008-2024.jpg" },

  // GWM
  { id:"haval_h6",   marca:"gwm",       nome:"Haval H6",       categoria:"SUV Médio",      ano:2024, preco:219990, consumo:11.2, potencia:190, portamalas:592, manutencao:"media",    desvalorizacao:"alta",   seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/Zp9bN/s3/gwm-haval-h6-2024.jpg" },
  { id:"ora",        marca:"gwm",       nome:"ORA 03",         categoria:"Hatch Elétrico", ano:2024, preco:149990, consumo:0,    potencia:143, portamalas:228, manutencao:"acessivel", desvalorizacao:"alta",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/mqGE2/s3/gwm-ora-2024.jpg" },

  // RAM
  { id:"ram1500",    marca:"ram",       nome:"Ram 1500",       categoria:"Picape Grande",  ano:2024, preco:499990, consumo:9.0,  potencia:395, portamalas:1660,manutencao:"cara",     desvalorizacao:"media",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/e8Vkb/s3/ram-1500-2024.jpg" },

  // BYD
  { id:"byd_dolphin",marca:"byd",       nome:"Dolphin",        categoria:"Hatch Elétrico", ano:2024, preco:149990, consumo:0,    potencia:204, portamalas:345, manutencao:"acessivel", desvalorizacao:"alta",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/7xoJj/s3/byd-dolphin-2024.jpg" },
  { id:"byd_seal",   marca:"byd",       nome:"Seal",           categoria:"Sedan Elétrico", ano:2024, preco:229990, consumo:0,    potencia:313, portamalas:400, manutencao:"acessivel", desvalorizacao:"alta",  seguranca:"excelente", img:"https://cdn.motor1.com/images/mgl/xg6kP/s3/byd-seal-2024.jpg" },
  { id:"byd_yuan",   marca:"byd",       nome:"Yuan Plus",      categoria:"SUV Elétrico",   ano:2024, preco:189990, consumo:0,    potencia:201, portamalas:440, manutencao:"acessivel", desvalorizacao:"alta",  seguranca:"boa",       img:"https://cdn.motor1.com/images/mgl/9bkGv/s3/byd-yuan-plus-2024.jpg" },
];

// ============================================================
// Pesos dos critérios
// ============================================================
const PESOS = {
  preco:         0.25,
  consumo:       0.20,
  manutencao:    0.20,
  desvalorizacao:0.20,
  seguranca:     0.10,
  portamalas:    0.05,
};

// ============================================================
// Conversão de strings para scores numéricos (0–10)
// ============================================================
function scoreManutencao(v)    { return { acessivel:10, media:6, cara:2 }[v] ?? 5; }
function scoreDesvalorizacao(v){ return { baixa:10, media:6, alta:2 }[v] ?? 5; }
function scoreSeguranca(v)     { return { excelente:10, boa:7, regular:4, pessima:1 }[v] ?? 5; }

function calcScore(carro, todos) {
  const precos    = todos.map(c => c.preco);
  const consumos  = todos.map(c => c.consumo > 0 ? c.consumo : 15); // elétrico = bônus
  const pts       = todos.map(c => c.portamalas);

  const norm = (v, min, max) => max === min ? 5 : ((v - min) / (max - min)) * 10;
  const normInv = (v, min, max) => max === min ? 5 : ((max - v) / (max - min)) * 10;

  const minPreco = Math.min(...precos), maxPreco = Math.max(...precos);
  const minCons  = Math.min(...consumos), maxCons  = Math.max(...consumos);
  const minPt    = Math.min(...pts), maxPt    = Math.max(...pts);

  const consumoVal = carro.consumo > 0 ? carro.consumo : 18; // elétrico pontuação máxima

  const s = {
    preco:         normInv(carro.preco,   minPreco, maxPreco),
    consumo:       norm(consumoVal,        minCons,  maxCons),
    manutencao:    scoreManutencao(carro.manutencao),
    desvalorizacao:scoreDesvalorizacao(carro.desvalorizacao),
    seguranca:     scoreSeguranca(carro.seguranca),
    portamalas:    norm(carro.portamalas, minPt,    maxPt),
  };

  const total =
    s.preco         * PESOS.preco         +
    s.consumo       * PESOS.consumo       +
    s.manutencao    * PESOS.manutencao    +
    s.desvalorizacao* PESOS.desvalorizacao+
    s.seguranca     * PESOS.seguranca     +
    s.portamalas    * PESOS.portamalas;

  return { ...s, total };
}
