// ============================================================
// clients.js — Gestão de clientes
// ============================================================

function saveClient() {
  const nome = document.getElementById('c-nome').value.trim();
  if (!nome) { notif('Preenche o nome!', true); return; }

  const c = {
    id:    Date.now(),
    nome,
    end:   document.getElementById('c-end').value,
    local: document.getElementById('c-local').value,
    tel:   document.getElementById('c-tel').value,
  };

  state.clients.push(c);
  saveState();

  ['c-nome', 'c-end', 'c-local', 'c-tel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  populateClientSel();
  renderClients();
  notif('Cliente guardado! ✅');
}

function renderClients() {
  const el = document.getElementById('clients-list');
  document.getElementById('c-count').textContent = state.clients.length + ' cliente(s)';

  if (!state.clients.length) {
    el.innerHTML = '<div class="empty">Nenhum cliente registado</div>';
    return;
  }

  el.innerHTML = state.clients.map(c => `
    <div class="client-item">
      <div class="c-av">${c.nome.substring(0, 2).toUpperCase()}</div>
      <div class="c-info">
        <div class="cn">${c.nome}</div>
        <div class="cm">${[c.tel, c.local].filter(Boolean).join(' · ')}</div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteClient(${c.id})">🗑️ Eliminar</button>
    </div>
  `).join('');
}

function deleteClient(id) {
  if (!confirm('Eliminar este cliente?')) return;
  state.clients = state.clients.filter(c => c.id !== id);
  saveState();
  populateClientSel();
  renderClients();
}
