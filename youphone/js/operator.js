// ============================================================
// operator.js — Troca de operadora activa e actualização do ecrã
// ============================================================

function setOp(op) {
  state.op = op;
  const m = OP_META[op];

  // Actualiza botões da barra lateral
  ['tmcel', 'vodacom', 'movitel'].forEach(o => {
    document.getElementById('op-' + o).className = 'op-btn ' + o + (o === op ? ' active' : '');
  });

  // Actualiza o indicador no topo
  const pill = document.getElementById('topbar-pill');
  pill.className = 'op-pill ' + m.pillClass;
  pill.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:${m.color};display:inline-block"></span> ${m.label}`;

  // Actualiza o formulário de nova requisição
  const nextNum = genNum(op);
  document.getElementById('f-reqnum').value = nextNum;
  document.getElementById('f-reqnum').style.color = m.color;
  document.getElementById('req-op-label').textContent = m.label;
  document.getElementById('req-op-label').style.color = m.color;

  // Actualiza os cards de estatísticas
  document.getElementById('stat-nextreq').textContent = nextNum;
  document.getElementById('stat-nextreq').style.color = m.color;
  document.getElementById('stat-op-name').textContent = m.label;

  // Actualiza a cor do botão Guardar
  document.getElementById('save-btn').className = 'btn btn-' + op;

  // Reconstrói a tabela de recargas e recalcula totais
  buildItems();
  calcTotals();
  updateStats();
}
