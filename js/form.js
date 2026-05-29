// ============================================================
// form.js — Formulário de nova requisição, tabela de recargas,
//           cálculo de totais, guardar e imprimir
// ============================================================

// Constrói as linhas da tabela de recargas para a operadora activa
function buildItems() {
  const tbody = document.getElementById('items-body');
  tbody.innerHTML = '';
  const list = state.items[state.op];
  list.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:500">${item.desc}</td>
      <td class="r mono">${item.price === 0 ? 'Grátis' : fmt(item.price)}</td>
      <td class="r">
        <input type="number" min="0" value="0" id="qty-${i}"
               class="qty-inp" oninput="onQty(this,${i})">
      </td>
      <td class="r mono" id="rt-${i}" style="color:var(--text3)">—</td>
    `;
    tbody.appendChild(tr);
  });
}

// Chamado quando a quantidade de uma linha muda
function onQty(el, i) {
  el.classList.toggle('filled', parseInt(el.value) > 0);
  calcTotals();
}

// Recalcula todos os totais (facial, desconto, total a pagar)
function calcTotals() {
  let sub = 0;
  state.items[state.op].forEach((item, i) => {
    const el = document.getElementById('qty-' + i);
    if (!el) return;
    const q = parseInt(el.value) || 0;
    const t = q * item.price;
    sub += t;
    const rtEl = document.getElementById('rt-' + i);
    if (rtEl) {
      rtEl.textContent = q > 0 ? fmt(t) : '—';
      rtEl.style.color = q > 0 ? 'var(--text)' : 'var(--text3)';
    }
  });

  const pct   = parseFloat(document.getElementById('pct-in').value) || 0;
  const disc  = sub * (pct / 100);
  const total = sub - disc;

  document.getElementById('sh-val').textContent      = fmt(sub);
  document.getElementById('tl-facial').textContent   = fmt(sub)   + ' MT';
  document.getElementById('tl-disc').textContent     = fmt(disc)  + ' MT';
  document.getElementById('tl-total').textContent    = fmt(total) + ' MT';
}

// Devolve apenas as linhas com quantidade > 0
function getItems() {
  return state.items[state.op].map((item, i) => {
    const el = document.getElementById('qty-' + i);
    const q  = parseInt(el?.value) || 0;
    return q > 0
      ? { desc: item.desc, price: item.price, qty: q, total: q * item.price }
      : null;
  }).filter(Boolean);
}

// Guarda a requisição no histórico
function saveReq() {
  const nome = document.getElementById('f-nome').value.trim();
  if (!nome) { notif('Preenche o nome do cliente!', true); return; }

  const items = getItems();
  if (!items.length) { notif('Adiciona pelo menos uma recarga!', true); return; }

  const sub  = items.reduce((a, b) => a + b.total, 0);
  const pct  = parseFloat(document.getElementById('pct-in').value) || 0;
  const num  = document.getElementById('f-reqnum').value.trim() || genNum(state.op);

  const req = {
    id:    Date.now(),
    num,
    op:    state.op,
    data:  document.getElementById('f-data').value || new Date().toISOString().split('T')[0],
    nome,
    end:   document.getElementById('f-end').value,
    local: document.getElementById('f-local').value,
    tel:   document.getElementById('f-tel').value,
    doc:   document.getElementById('f-doc').value,
    items,
    subtotal: sub,
    pct,
    total: sub - (sub * (pct / 100))
  };

  state.reqs.unshift(req);
  state.counters[state.op]++;
  saveState();
  notif('Requisição ' + num + ' guardada! ✅');
  setOp(state.op);
  clearForm(true);
  updateStats();
}

// Limpa os campos do formulário
function clearForm(keepMeta) {
  if (!keepMeta) {
    ['f-nome', 'f-end', 'f-local', 'f-tel', 'f-doc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('client-sel').value = '';
  }
  state.items[state.op].forEach((_, i) => {
    const el = document.getElementById('qty-' + i);
    if (el) { el.value = 0; el.classList.remove('filled'); }
  });
  calcTotals();
}

// Preenche o formulário com os dados de um cliente registado
function loadClient() {
  const id = parseInt(document.getElementById('client-sel').value);
  if (!id) return;
  const c = state.clients.find(x => x.id === id);
  if (!c) return;
  document.getElementById('f-nome').value  = c.nome;
  document.getElementById('f-end').value   = c.end   || '';
  document.getElementById('f-local').value = c.local || '';
  document.getElementById('f-tel').value   = c.tel   || '';
}

// Preenche o select de clientes
function populateClientSel() {
  const sel = document.getElementById('client-sel');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— Seleccionar cliente registado —</option>';
  state.clients.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id;
    o.textContent = c.nome;
    sel.appendChild(o);
  });
  sel.value = cur;
}

// Abre janela de impressão com o documento formatado
function printReq() {
  const nome  = document.getElementById('f-nome').value || '—';
  const items = getItems();
  const sub   = items.reduce((a, b) => a + b.total, 0);
  const pct   = parseFloat(document.getElementById('pct-in').value) || 0;
  const total = sub - (sub * (pct / 100));
  const disc  = sub * (pct / 100);
  const num   = document.getElementById('f-reqnum').value || genNum(state.op);
  const data  = document.getElementById('f-data').value  || new Date().toISOString().split('T')[0];
  const op    = state.op;
  const m     = OP_META[op];
  const end   = document.getElementById('f-end').value   || '';
  const local = document.getElementById('f-local').value || '';
  const tel   = document.getElementById('f-tel').value   || '';
  const docn  = document.getElementById('f-doc').value   || '';

  const itemRows = items.map(it => `
    <tr>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;font-size:13px;font-weight:500">${it.desc}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;text-align:right;font-size:12px;font-family:monospace">${it.qty.toLocaleString()}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;text-align:right;font-size:12px;font-family:monospace">${it.price === 0 ? 'Grátis' : fmt(it.price)}</td>
      <td style="padding:9px 12px;border-bottom:1px solid #eee;text-align:right;font-size:12px;font-family:monospace;font-weight:600">${fmt(it.total)}</td>
    </tr>
  `).join('');

  let headerGrad = '';
  if (op === 'tmcel')   headerGrad = 'linear-gradient(135deg, #007a3d 0%, #005a2d 50%, #f5c400 100%)';
  if (op === 'vodacom') headerGrad = 'linear-gradient(135deg, #e2001a 0%, #9e0012 60%, #cc0015 100%)';
  if (op === 'movitel') headerGrad = 'linear-gradient(135deg, #f47920 0%, #d06010 60%, #ff9940 100%)';

  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>${num}</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Sora',sans-serif;background:#fff;color:#1c2333;font-size:13px}
    .page{max-width:760px;margin:0 auto;padding:0}
    .header{background:${headerGrad};padding:28px 32px;display:flex;justify-content:space-between;align-items:flex-start}
    .h-left .company{font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px}
    .h-left .company-sub{font-size:11px;color:rgba(255,255,255,0.7);margin-top:3px;text-transform:uppercase;letter-spacing:0.07em}
    .h-left .city{font-size:11px;color:rgba(255,255,255,0.6);margin-top:2px}
    .h-right{text-align:right}
    .h-right .op-name{font-size:28px;font-weight:800;color:#fff;opacity:0.95}
    .h-right .req-type{font-size:11px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.1em}
    .doc-header{padding:20px 32px;border-bottom:2px solid ${m.color};background:#fafafa;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
    .dh-box .dk{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9ba3b8;margin-bottom:4px}
    .dh-box .dv{font-size:15px;font-weight:700;font-family:'JetBrains Mono',monospace;color:${m.color}}
    .section{padding:20px 32px;border-bottom:1px solid #e8e8e8}
    .section-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ba3b8;margin-bottom:12px;display:flex;align-items:center;gap:8px}
    .section-title::after{content:'';flex:1;height:1px;background:#e8e8e8}
    .client-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .cf .ck{font-size:10px;color:#9ba3b8;margin-bottom:2px}
    .cf .cv{font-size:13px;font-weight:500}
    table{width:100%;border-collapse:collapse}
    thead{background:${m.color}}
    th{padding:10px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#fff;text-align:left}
    th.r{text-align:right}
    .totals-section{padding:20px 32px;display:flex;justify-content:flex-end}
    .tot-box{width:280px}
    .tl{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-bottom:1px solid #f0f0f0}
    .tl:last-child{border-bottom:none}
    .tl.grand{padding-top:10px;border-top:2px solid ${m.color};margin-top:4px;font-weight:700;font-size:15px}
    .tl .tk{color:#5a6480}
    .tl.grand .tk{color:#1c2333}
    .tl .tv{font-family:'JetBrains Mono',monospace;font-size:12px}
    .tl.grand .tv{font-size:16px;color:${m.color}}
    .bottom-band{background:${headerGrad};height:6px;margin-top:20px}
    .footer-note{padding:14px 32px;text-align:center;font-size:10px;color:#9ba3b8;border-top:1px solid #eee}
    @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
  </style></head><body>
  <div class="page">
    <div class="header">
      <div class="h-left">
        <div class="company">YouPhone S.A</div>
        <div class="company-sub">Telecomunicações & Recargas</div>
        <div class="city">📍 Beira, Sofala · Moçambique</div>
      </div>
      <div class="h-right">
        <div class="op-name">${m.label}</div>
        <div class="req-type">Requisição Oficial</div>
      </div>
    </div>
    <div class="doc-header">
      <div class="dh-box"><div class="dk">Número</div><div class="dv">${num}</div></div>
      <div class="dh-box"><div class="dk">Data</div><div class="dv" style="font-size:13px">${data}</div></div>
      <div class="dh-box"><div class="dk">Operadora</div><div class="dv">${m.label}</div></div>
    </div>
    <div class="section">
      <div class="section-title">Dados do Cliente</div>
      <div class="client-grid">
        <div class="cf"><div class="ck">Nome / Empresa</div><div class="cv">${nome}</div></div>
        <div class="cf"><div class="ck">Telefone</div><div class="cv">${tel || '—'}</div></div>
        <div class="cf"><div class="ck">Endereço</div><div class="cv">${end || '—'}</div></div>
        <div class="cf"><div class="ck">Localidade</div><div class="cv">${local || '—'}</div></div>
        <div class="cf"><div class="ck">Nº Documento</div><div class="cv">${docn || '—'}</div></div>
      </div>
    </div>
    <div class="section" style="padding-bottom:0">
      <div class="section-title">Recargas Requisitadas</div>
      <table>
        <thead><tr>
          <th>Descrição</th><th class="r">Quantidade</th>
          <th class="r">Preço Unit. (MT)</th><th class="r">Total (MT)</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>
    <div class="totals-section">
      <div class="tot-box">
        <div class="tl"><span class="tk">Preço Facial</span><span class="tv">${fmt(sub)} MT</span></div>
        <div class="tl"><span class="tk">Desconto (${pct}%)</span><span class="tv">- ${fmt(disc)} MT</span></div>
        <div class="tl grand"><span class="tk">TOTAL A PAGAR</span><span class="tv">${fmt(total)} MT</span></div>
      </div>
    </div>
    <div class="footer-note">Documento emitido por YouPhone S.A · Beira, Sofala, Moçambique · ${num}</div>
    <div class="bottom-band"></div>
  </div>
  <script>window.onload=()=>{setTimeout(()=>window.print(),400)}<\/script>
  </body></html>`);
  w.document.close();
}
