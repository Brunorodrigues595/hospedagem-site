// BANCO DE DADOS DE JOGOS
const games = [
  {
    id: 1,
    title: "Grand Theft Auto VI",
    category: "acao",
    oldPrice: 349.90,
    price: 314.91,
    discount: "-10%",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    tags: ["Ação", "Mundo Aberto"]
  },
  {
    id: 2,
    title: "Elden Ring: Shadow of the Erdtree",
    category: "rpg",
    oldPrice: 229.90,
    price: 183.92,
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    tags: ["RPG", "Soulslike"]
  },
  {
    id: 3,
    title: "Cyberpunk 2077: Phantom Liberty",
    category: "rpg",
    oldPrice: 199.90,
    price: 99.95,
    discount: "-50%",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
    tags: ["Ficção Científica", "RPG"]
  },
  {
    id: 4,
    title: "Red Dead Redemption 2",
    category: "aventura",
    oldPrice: 299.90,
    price: 89.97,
    discount: "-70%",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    tags: ["Mundo Aberto", "Aventura"]
  },
  {
    id: 5,
    title: "Forza Horizon 5",
    category: "corrida",
    oldPrice: 249.00,
    price: 124.50,
    discount: "-50%",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80",
    tags: ["Corrida", "Simulação"]
  },
  {
    id: 6,
    title: "EA SPORTS FC 25",
    category: "estrategia",
    oldPrice: 350.00,
    price: 175.00,
    discount: "-50%",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80",
    tags: ["Esporte", "Estratégia"]
  }
];

let cart = [];

// ELEMENTOS DOM
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const heroBuyBtn = document.getElementById('heroBuyBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const filterBar = document.getElementById('filterBar');
const catalogCount = document.getElementById('catalogCount');

// RENDERIZAR JOGOS NO CATÁLOGO
function renderGames(gamesList) {
  gamesGrid.innerHTML = '';
  catalogCount.innerText = `${gamesList.length} jogo(s) encontrado(s)`;

  gamesList.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <div class="card-thumb">
        <img src="${game.image}" alt="${game.title}">
        <span class="card-discount">${game.discount}</span>
      </div>
      <div class="card-body">
        <div class="card-tags">
          ${game.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
        </div>
        <h3 class="card-title">${game.title}</h3>
        <div class="card-footer">
          <div class="price-box">
            <span class="old-price">R$ ${game.oldPrice.toFixed(2).replace('.', ',')}</span>
            <span class="current-price" style="font-size: 1.1rem;">R$ ${game.price.toFixed(2).replace('.', ',')}</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart(${game.id})" title="Adicionar ao Carrinho">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>
    `;
    gamesGrid.appendChild(card);
  });
}

// ADICIONAR E REMOVER DO CARRINHO
function addToCart(gameId) {
  const game = games.find(g => g.id === gameId);
  if (game) {
    cart.push(game);
    updateCartUI();
    showToast(`"${game.title}" adicionado ao carrinho!`);
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// ATUALIZAR INTERFACE DO CARRINHO
function updateCartUI() {
  cartCount.innerText = cart.length;
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
  } else {
    cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" class="cart-item-img" alt="${item.title}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartSubtotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
  cartTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// FILTRAGEM POR CATEGORIA
filterBar.addEventListener('click', (e) => {
  const chip = e.target.closest('.category-chip');
  if (chip) {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const cat = chip.getAttribute('data-category');
    if (cat === 'all') {
      renderGames(games);
    } else {
      renderGames(games.filter(g => g.category === cat));
    }
  }
});

// CAMPO DE BUSCA
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = games.filter(g => 
    g.title.toLowerCase().includes(term) || 
    g.tags.some(tag => tag.toLowerCase().includes(term))
  );
  renderGames(filtered);
});

// ABRIR E FECHAR DRAWER
function openCart() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCart() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
}

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// BOTÃO COMPRAR DO HERO (GTA VI)
heroBuyBtn.addEventListener('click', () => {
  addToCart(1);
  openCart();
});

// FINALIZAR COMPRA
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast("Adicione um jogo antes de finalizar!");
    return;
  }
  alert("Compra efetuada com sucesso! As chaves do jogo foram enviadas para o seu e-mail.");
  cart = [];
  updateCartUI();
  closeCart();
});

// TOAST NOTIFICATION
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMessage').innerText = msg;
  toast.style.display = 'flex';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2500);
}

// INICIALIZAÇÃO
renderGames(games);