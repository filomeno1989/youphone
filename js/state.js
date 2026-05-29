// ============================================================
// state.js — Estado da aplicação e gravação no navegador
// Tudo o que é guardado entre sessões está aqui.
// ============================================================

// Estado inicial da aplicação
let state = {
  op: "tmcel",
  counters: { tmcel: 5015, vodacom: 1001, movitel: 2001 },
  reqs: [],
  clients: [
    {
      id: 1,
      nome: "OMNIA HOLDING S,A",
      end:  "Av. Filipe Samuel Magaia n-940",
      local: "Beira, Sofala",
      tel:  "84 400 6008"
    }
  ],
  pending: [],
  items: JSON.parse(JSON.stringify(DEFAULT_ITEMS)) // cópia dos dados padrão
};

// Carrega o estado guardado anteriormente no navegador
function loadState() {
  try {
    const d = localStorage.getItem('youphone_v4');
    if (d) {
      const p = JSON.parse(d);
      if (p.counters) state.counters = p.counters;
      if (p.reqs)     state.reqs     = p.reqs;
      if (p.clients)  state.clients  = p.clients;
      if (p.pending)  state.pending  = p.pending;
      if (p.items)    state.items    = p.items;
    }
  } catch (e) {
    console.warn('Erro ao carregar estado:', e);
  }
}

// Grava o estado actual no navegador
function saveState() {
  try {
    localStorage.setItem('youphone_v4', JSON.stringify(state));
  } catch (e) {
    console.warn('Erro ao gravar estado:', e);
  }
}
