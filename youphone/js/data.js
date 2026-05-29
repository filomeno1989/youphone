// ============================================================
// data.js — Dados fixos: recargas padrão e informação das operadoras
// Para alterar preços ou adicionar recargas, edita aqui ou usa
// o ecrã de Configurações dentro da aplicação.
// ============================================================

const DEFAULT_ITEMS = {
  tmcel: [
    { desc: "Recarga 10 MT",          price: 10   },
    { desc: "Recarga 20 MT",          price: 20   },
    { desc: "Recarga 50 MT",          price: 50   },
    { desc: "Recarga 100 MT",         price: 100  },
    { desc: "Recarga 200 MT",         price: 200  },
    { desc: "Recarga 300 MT",         price: 300  },
    { desc: "Recarga 600 MT",         price: 600  },
    { desc: "Recarga 2000 MT",        price: 2000 },
    { desc: "Pacote Inicial Custo Zero", price: 0 },
  ],
  vodacom: [
    { desc: "Recarga 10 MT",   price: 10   },
    { desc: "Recarga 20 MT",   price: 20   },
    { desc: "Recarga 50 MT",   price: 50   },
    { desc: "Recarga 100 MT",  price: 100  },
    { desc: "Recarga 200 MT",  price: 200  },
    { desc: "Recarga 500 MT",  price: 500  },
    { desc: "Recarga 1000 MT", price: 1000 },
    { desc: "Pacote Inicial",  price: 8    },
  ],
  movitel: [
    { desc: "Recarga 10 MT",   price: 10   },
    { desc: "Recarga 20 MT",   price: 20   },
    { desc: "Recarga 50 MT",   price: 50   },
    { desc: "Recarga 100 MT",  price: 100  },
    { desc: "Recarga 200 MT",  price: 200  },
    { desc: "Recarga 300 MT",  price: 300  },
    { desc: "Recarga 500 MT",  price: 500  },
    { desc: "Recarga 700 MT",  price: 700  },
    { desc: "Recarga 1000 MT", price: 1000 },
    { desc: "Pacote Inicial",  price: 0    },
  ]
};

// Cores, nomes e prefixos de cada operadora
const OP_META = {
  tmcel:   { label: "Tmcel",   color: "#007a3d", accent: "#f5c400", prefix: "T", pillClass: "tmcel"   },
  vodacom: { label: "Vodacom", color: "#e2001a", accent: "#ffffff", prefix: "V", pillClass: "vodacom" },
  movitel: { label: "Movitel", color: "#f47920", accent: "#ffffff", prefix: "M", pillClass: "movitel" },
};
