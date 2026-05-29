// ============================================================
// pending.js — Pedidos recebidos através do formulário público
// ============================================================

function renderPending() {
  const el = document.getElementById('pendentes-list');

  if (!state.pending.length) {
    el.innerHTML = '<div class="empty">Nenhum pedido pendente de clientes 🎉</div>';
    return;
  }

  el.innerHTML = state.pending.map(p => `
    <div class="pending-item">
      <div class="pi-info">
        <div class="pin">${p.nome} <span class="badge-new">NOVO</span></div>
        <div class="pim">${OP_META[p.op].label} · ${p.items.length} linha(s) · ${p.data}</div>
      </div>
      <div class="pi-actions">
        <button class="btn btn-dark btn-sm" onclick="acceptPending(${p.id})">✅ Aceitar e preencher</button>
        <button class="btn btn-danger btn-sm" onclick="deletePending(${p.id})">🗑️</button>
      </div>
    </div>
  `).join('');

  updatePendingBadge();
}

function acceptPending(id) {
  const p = state.pending.find(x => x.id === id);
  if (!p) return;
  setOp(p.op);
  setView('nova');
  setTimeout(() => {
    document.getElementById('f-nome').value  = p.nome;
    document.getElementById('f-end').value   = p.end   || '';
    document.getElementById('f-local').value = p.local || '';
    document.getElementById('f-tel').value   = p.tel   || '';
    document.getElementById('f-doc').value   = p.doc   || '';
    p.items.forEach(item => {
      const i  = state.items[p.op].findIndex(d => d.desc === item.desc);
      const el = document.getElementById('qty-' + i);
      if (el) { el.value = item.qty; el.classList.add('filled'); }
    });
    calcTotals();
    state.pending = state.pending.filter(x => x.id !== id);
    saveState();
    updatePendingBadge();
    notif('Pedido carregado. Verifica e guarda! ✅');
  }, 150);
}

function deletePending(id) {
  state.pending = state.pending.filter(x => x.id !== id);
  saveState();
  renderPending();
  updatePendingBadge();
}

function updatePendingBadge() {
  const n = state.pending.length;
  const b = document.getElementById('pending-badge');
  b.textContent  = n;
  b.style.display = n > 0 ? 'inline' : 'none';
}
