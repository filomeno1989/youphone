// ============================================================
// public.js — Formulário público para clientes fazerem pedidos
// ============================================================

let pubSelOp = null;

function pubSelectOp(op) {
  pubSelOp = op;
  const m  = OP_META[op];

  // Destaca o card seleccionado
  ['tmcel', 'vodacom', 'movitel'].forEach(o => {
    document.getElementById('pub-card-' + o).className = 'op-card' + (o === op ? ' sel-' + o : '');
  });

  // Título da operadora
  document.getElementById('pub-op-title').textContent = `📱 Requisição ${m.label}`;
  document.getElementById('pub-op-title').style.color = m.color;

  // Constrói a lista de recargas para o cliente escolher
  const el = document.getElementById('pub-items-list');
  el.innerHTML = state.items[op].map((item, i) => `
    <div class="pub-item">
      <div>
        <div class="pi-desc">${item.desc}</div>
        <div class="pi-price">${item.price === 0 ? 'Grátis' : fmt(item.price) + ' MT'}</div>
      </div>
      <div class="pi-qty">
        <input type="number" min="0" value="0" id="pub-qty-${i}"
               class="qty-inp" oninput="calcPubTotal()" style="width:80px">
      </div>
    </div>
  `).join('');

  // Muda para o passo do formulário
  document.getElementById('pub-step-op').style.display   = 'none';
  document.getElementById('pub-step-form').style.display = 'block';
  document.getElementById('pub-step-ok').style.display   = 'none';
}

function calcPubTotal() {
  let sub = 0;
  state.items[pubSelOp].forEach((item, i) => {
    const el = document.getElementById('pub-qty-' + i);
    sub += (parseInt(el?.value) || 0) * item.price;
  });
  document.getElementById('pub-total-val').textContent = fmt(sub) + ' MT';
}

function submitPubReq() {
  const nome = document.getElementById('pub-nome').value.trim();
  if (!nome) { notif('Preenche o teu nome!', true); return; }

  const items = state.items[pubSelOp].map((item, i) => {
    const q = parseInt(document.getElementById('pub-qty-' + i)?.value) || 0;
    return q > 0 ? { desc: item.desc, price: item.price, qty: q, total: q * item.price } : null;
  }).filter(Boolean);

  if (!items.length) { notif('Selecciona pelo menos uma recarga!', true); return; }

  const p = {
    id:    Date.now(),
    op:    pubSelOp,
    data:  new Date().toISOString().split('T')[0],
    nome,
    end:   document.getElementById('pub-end').value,
    local: document.getElementById('pub-local').value,
    tel:   document.getElementById('pub-tel').value,
    doc:   document.getElementById('pub-doc').value,
    items,
  };

  state.pending.push(p);
  saveState();
  updatePendingBadge();

  document.getElementById('pub-step-form').style.display = 'none';
  document.getElementById('pub-step-ok').style.display   = 'block';
}

function pubBack() {
  document.getElementById('pub-step-op').style.display   = 'block';
  document.getElementById('pub-step-form').style.display = 'none';
  pubSelOp = null;
}

function pubReset() {
  pubSelOp = null;
  ['tmcel', 'vodacom', 'movitel'].forEach(o => {
    document.getElementById('pub-card-' + o).className = 'op-card';
  });
  document.getElementById('pub-step-op').style.display   = 'block';
  document.getElementById('pub-step-form').style.display = 'none';
  document.getElementById('pub-step-ok').style.display   = 'none';
  document.getElementById('pub-nome').value = '';
}
