// ============================================================
// utils.js — Funções auxiliares usadas em toda a aplicação
// ============================================================

// Formata um número como moeda moçambicana (ex: 1.234,50)
function fmt(n) {
  return n.toLocaleString('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Mostra uma notificação no canto inferior direito do ecrã
// isErr = true para vermelho (erro), false/omitido para escuro (sucesso)
function notif(msg, isErr) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.className = 'notif' + (isErr ? ' err' : '');
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => el.style.display = 'none', 3200);
}

// Gera o número da próxima requisição para uma operadora
// Exemplo: "Req. T-5015"
function genNum(op) {
  const m = OP_META[op];
  const n = String(state.counters[op]).padStart(4, '0');
  return `Req. ${m.prefix}-${n}`;
}

// Abre/fecha a barra lateral no telemóvel
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
