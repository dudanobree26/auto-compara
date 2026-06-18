# AUTOCOMPARA — Guia de Deploy no Vercel

Projeto Final de Curso · Turma 2 · Análise de Dados · Generation Brasil

## Arquivos do projeto
```
autocompara/
├── index.html      ← Página principal
├── style.css       ← Estilos (cores branco, preto, azul)
├── data.js         ← Base de dados dos 50 veículos
├── app.js          ← Lógica de interação
├── vercel.json     ← Configuração do Vercel
└── README.md       ← Este arquivo
```

---

## ✅ Como publicar no Vercel (passo a passo)

### Opção A — Via GitHub (recomendado)

1. **Crie uma conta no GitHub** (github.com) se ainda não tiver.
2. **Crie um repositório novo** chamado `autocompara` (pode ser público).
3. **Faça upload dos 5 arquivos** (`index.html`, `style.css`, `data.js`, `app.js`, `vercel.json`) clicando em "Add file > Upload files".
4. **Acesse** https://vercel.com e faça login com sua conta GitHub.
5. Clique em **"Add New Project"** → selecione o repositório `autocompara`.
6. Clique em **"Deploy"** — o Vercel detecta automaticamente que é um site estático.
7. Em ~1 minuto seu site estará no ar em uma URL como `autocompara.vercel.app`.

### Opção B — Via Vercel CLI (terminal)

```bash
npm i -g vercel
cd pasta-do-projeto
vercel
# Responda as perguntas e o site vai ao ar
```

---

## 📸 Como adicionar fotos da equipe

1. Prepare as fotos (preferencialmente quadradas, ex: 400x400px, formato .jpg ou .png).
2. Nomeie os arquivos: `eduarda.jpg`, `thais.jpg`, `william.jpg`, `diana.jpg`, `tainara.jpg`.
3. Crie uma pasta `fotos/` dentro do projeto e coloque as imagens lá.
4. No arquivo `app.js`, na seção `EQUIPE`, substitua `foto: null` pelo caminho:

```javascript
const EQUIPE = [
  { nome: "Eduarda Nobre",     iniciais: "EN", foto: "fotos/eduarda.jpg" },
  { nome: "Thaís Domingues",   iniciais: "TD", foto: "fotos/thais.jpg" },
  { nome: "William Bertolotto",iniciais: "WB", foto: "fotos/william.jpg" },
  { nome: "Diana Soares",      iniciais: "DS", foto: "fotos/diana.jpg" },
  { nome: "Tainara Sales",     iniciais: "TS", foto: "fotos/tainara.jpg" },
];
```

5. Faça commit e push — o Vercel republicará automaticamente.

---

## 📊 Como atualizar os dados dos veículos

Os dados estão em `data.js` no array `CARROS`. Cada veículo segue este formato:

```javascript
{ 
  id:"nome_unico",       // identificador único (sem espaços)
  marca:"chevrolet",     // id da marca (minúsculo)
  nome:"Nome do Carro",  // nome exibido
  categoria:"Hatch",     // categoria
  ano:2024,              // ano de lançamento
  preco:82990,           // preço em R$ (sem pontos/vírgulas)
  consumo:14.5,          // km/l (0 = elétrico)
  potencia:101,          // cavalos
  portamalas:222,        // litros
  manutencao:"acessivel",// acessivel | media | cara
  desvalorizacao:"media",// baixa | media | alta
  seguranca:"boa",       // excelente | boa | regular | pessima
  img:"URL_DA_IMAGEM"    // link direto para a foto do carro
}
```

---

## ⚠️ Nota sobre os dados

Os dados de preço, consumo, potência e demais especificações são **estimativas** baseadas em fontes públicas (FIPE, Webmotors, fabricantes) e podem conter **inconsistências**. O site já exibe um aviso ao usuário sobre isso. Recomenda-se atualizar os dados com fontes primárias antes da apresentação final.

---

## Equipe
- Eduarda Nobre
- Thaís Domingues
- William Bertolotto
- Diana Soares
- Tainara Sales

**Turma 2 · Análise de Dados · Generation Brasil · 2025**
