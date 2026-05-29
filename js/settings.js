// ============================================================
// settings.js — Configuração das recargas por operadora
// ============================================================

function renderSettings() {
  ['tmcel', 'vodacom', 'movitel'].forEach(op => {
    const el = document.getElementById('cfg-' + op);
    el.innerHTML = state.items[op].map((item, i) => `
      <div class="item-row">
        <input type="text"   value="${item.desc}"  id="cfg-desc-${op}-${i}"  placeholder="Descrição" style="flex:2">
        <input type="number" value="${item.price}" id="cfg-price-${op}-${i}" placeholder="Preço MT" class="price-input">
        <button class="btn btn-danger btn-sm" onclick="removeItem('${op}',${i})">✕</button>
      </div>
    `).join('');
  });
}

function addItem(op) {
  state.items[op].push({ desc: 'Nova recarga', price: 0 });
  renderSettings();
}

function removeItem(op, i) {
  state.items[op].splice(i, 1);
  renderSettings();
}

function saveSettings() {
  ['tmcel', 'vodacom', 'movitel'].forEach(op => {
    state.items[op] = state.items[op].map((_, i) => ({
      desc:  document.getElementById('cfg-desc-'  + op + '-' + i).value,
      price: parseFloat(document.getElementById('cfg-price-' + op + '-' + i).value) || 0,
    }));
  });
  saveState();
  buildItems();
  calcTotals();
  notif('Configurações guardadas! ✅');
}
