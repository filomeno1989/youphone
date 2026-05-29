// ============================================================
// history.js — Histórico de requisições
// ============================================================

function renderHist() {
  const q  = (document.getElementById('search-in').value || '').toLowerCase();
  const fo = document.getElementById('filter-op').value;

  let list = state.reqs.filter(r => {
    if (fo && r.op !== fo) return false;
    if (q && !r.num.toLowerCase().includes(q) && !r.nome.toLowerCase().includes(q)) return false;
    return true;
  });

  const el = document.getElementById('hist-list');
  if (!list.length) {
    el.innerHTML = '<div class="empty">Nenhuma requisição encontrada</div>';
    return;
  }

  el.innerHTML = list.map(r => `
    <div class="hist-item" onclick="openReq(${r.id})">
      <div class="hi-left">
        <div class="hi-stripe" style="background:${OP_META[r.op].color}"></div>
        <div class="hi-info">
          <div class="hn">${r.num}</div>
          <div class="hc">${r.nome}</div>
          <div class="hm">${r.data} · ${r.items.length} linha(s)</div>
        </div>
      </div>
      <div class="hi-right">
        <span class="tag tag-${r.op}">${OP_META[r.op].label}</span>
        <div class="hi-total">${fmt(r.total)} MT</div>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteReq(${r.id})">🗑️</button>
      </div>
    </div>
  `).join('');
}

function updateHistStats() {
  const total = state.reqs.length;
  const vol   = state.reqs.reduce((a, r) => a + r.subtotal, 0);
  const tc    = state.reqs.filter(r => r.op === 'tmcel').length;
  const vm    = state.reqs.filter(r => r.op !== 'tmcel').length;
  document.getElementById('hs-total').textContent = total;
  document.getElementById('hs-vol').textContent   = fmt(vol);
  document.getElementById('hs-t').textContent     = tc;
  document.getElementById('hs-vm').textContent    = vm;
}

// Abre uma requisição do histórico de volta no formulário
function openReq(id) {
  const r = state.reqs.find(x => x.id === id);
  if (!r) return;
  setOp(r.op);
  setView('nova');
  setTimeout(() => {
    document.getElementById('f-reqnum').value = r.num;
    document.getElementById('f-nome').value   = r.nome;
    document.getElementById('f-end').value    = r.end   || '';
    document.getElementById('f-local').value  = r.local || '';
    document.getElementById('f-tel').value    = r.tel   || '';
    document.getElementById('f-doc').value    = r.doc   || '';
    document.getElementById('f-data').value   = r.data  || '';
    document.getElementById('pct-in').value   = r.pct;
    r.items.forEach(item => {
      const i  = state.items[r.op].findIndex(d => d.desc === item.desc);
      const el = document.getElementById('qty-' + i);
      if (el) { el.value = item.qty; el.classList.add('filled'); }
    });
    calcTotals();
    notif('Requisição ' + r.num + ' aberta');
  }, 100);
}

function deleteReq(id) {
  if (!confirm('Eliminar esta requisição?')) return;
  state.reqs = state.reqs.filter(r => r.id !== id);
  saveState();
  renderHist();
  updateHistStats();
  updateStats();
}
