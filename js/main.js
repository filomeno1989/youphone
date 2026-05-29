// ============================================================
// main.js — Arranque, navegação entre vistas, estatísticas
//           e logout. Este ficheiro é sempre o último a carregar.
// ============================================================

// ── Protecção: se não estiver autenticado, volta ao login ──
if (sessionStorage.getItem('yp_loggedin') !== '1') {
  window.location.href = 'index.html';
}

// Mostra o nome do utilizador na barra lateral
const ypUser = sessionStorage.getItem('yp_user') || 'Utilizador';
document.getElementById('sb-username').textContent = ypUser;

// ── Navegação entre vistas ──
function setView(v) {
  ['nova', 'pendentes', 'historico', 'clientes', 'settings', 'public'].forEach(x => {
    document.getElementById('view-' + x).style.display = x === v ? 'block' : 'none';
    const nb = document.getElementById('nav-' + x);
    if (nb) nb.classList.toggle('active', x === v);
  });

  const titles = {
    nova:      'Nova Requisição',
    pendentes: 'Pedidos Recebidos',
    historico: 'Histórico',
    clientes:  'Clientes',
    settings:  'Configurações',
    public:    'Formulário do Cliente',
  };
  document.getElementById('topbar-title').textContent = titles[v] || v;
  document.getElementById('topbar-sub').textContent   =
    v === 'public' ? 'Partilha este link com os teus clientes' : '';

  // Acções específicas de cada vista ao abrir
  if (v === 'historico') { renderHist(); updateHistStats(); }
  if (v === 'clientes')  renderClients();
  if (v === 'settings')  renderSettings();
  if (v === 'pendentes') renderPending();

  // Fecha a barra lateral no telemóvel ao navegar
  if (window.innerWidth < 900) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// ── Estatísticas rápidas no topo ──
function updateStats() {
  document.getElementById('stat-ct').textContent = state.reqs.filter(r => r.op === 'tmcel').length;
  document.getElementById('stat-cv').textContent = state.reqs.filter(r => r.op === 'vodacom').length;
  document.getElementById('stat-cm').textContent = state.reqs.filter(r => r.op === 'movitel').length;
}

// ── Logout ──
function doLogout() {
  if (!confirm('Tens a certeza que queres sair?')) return;
  sessionStorage.clear();
  window.location.href = 'index.html';
}

// ── Responsivo: botão do menu no telemóvel ──
if (window.innerWidth < 900) {
  document.getElementById('menu-toggle').style.display = 'block';
}

// ── Inicialização ──
loadState();
document.getElementById('f-data').value = new Date().toISOString().split('T')[0];
document.getElementById('topbar-sub').textContent = new Date().toLocaleDateString('pt-MZ', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});
setOp('tmcel');
populateClientSel();
updateStats();
updatePendingBadge();
