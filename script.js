let perfumes = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let userLogged = localStorage.getItem('user') || null;

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadPerfumes();
  updateSession();
});

function setupEventListeners() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginBtn) loginBtn.addEventListener('click', handleLogin);
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', () => {
      if (a.getAttribute('href') === '#favorites' && !userLogged) {
        showLoginBox();
      }
    });
  });
}

function loadPerfumes() {
  fetch('perfumes.json')
    .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(data => {
      perfumes = data;
      showPopular();
      showProducts();
      showFavorites();
    })
    .catch(err => {
      console.error('Error cargando perfumes.json:', err);
      const productList = document.getElementById('productList');
      if (productList) productList.innerHTML = '<p>Error al cargar productos. Usa un servidor local (Live Server).</p>';
    });
}

function showPopular() {
  const list = document.getElementById('popularList');
  if (!list) return;
  list.innerHTML = '';
  perfumes.filter(p => p.popular).forEach(p => {
    list.innerHTML += `
      <div class="card">
        <div class="img-wrap"><img src="${p.image}" alt="${p.name}"></div>
        <h4>${p.name}</h4>
        <p>${p.brand}</p>
      </div>`;
  });
}

function showProducts() {
  const list = document.getElementById('productList');
  if (!list) return;
  list.innerHTML = '';
  perfumes.forEach(p => {
    const fav = favorites.includes(p.id);
    list.innerHTML += `
      <div class="card">
        <div class="img-wrap"><img src="${p.image}" alt="${p.name}"></div>
        <h4>${p.name}</h4>
        <p>${p.brand}</p>
        <p>$${p.price}</p>
        ${userLogged ? `<button class="fav-btn" onclick="toggleFavorite(${p.id})">
          <img src="img/${fav ? 'ic_favoritos' : 'ic_unfavoritos'}.png" alt="${fav ? 'Favorito' : 'No favorito'}">
        </button>` : ''}
      </div>`;
  });
}

function toggleFavorite(id) {
  if (!userLogged) {
    alert('Inicia sesión para guardar favoritos.');
    location.hash = '#favorites';
    showLoginBox();
    return;
  }
  if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
  else favorites.push(id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  showProducts();
  showFavorites();
}

function showFavorites() {
  const list = document.getElementById('favoriteList');
  if (!list) return;
  list.innerHTML = '';

  if (!userLogged) {
    list.innerHTML = `<p>Inicia sesión para ver favoritos.</p>`;
    return;
  }

  const favs = perfumes.filter(p => favorites.includes(p.id));
  if (favs.length === 0) {
    list.innerHTML = '<p>No tienes perfumes guardados.</p>';
    return;
  }

  favs.forEach(p => {
    const fav = favorites.includes(p.id);
    list.innerHTML += `
      <div class="card">
        <div class="img-wrap"><img src="${p.image}" alt="${p.name}"></div>
        <h4>${p.name}</h4>
        <p>${p.brand}</p>
        <p>$${p.price}</p>
        <button class="fav-btn" onclick="toggleFavorite(${p.id})">
          <img src="img/${fav ? 'ic_favoritos' : 'ic_unfavoritos'}.png" alt="favorito">
        </button>
      </div>`;
  });
}

function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) {
    alert('Introduce correo y contraseña válidos.');
    return;
  }
  localStorage.setItem('user', email);
  userLogged = email;
  updateSession();
  showProducts();
  showFavorites();
  location.hash = '#favorites';
}

function handleLogout() {
  localStorage.removeItem('user');
  userLogged = null;
  updateSession();
  showProducts();
  showFavorites();
}

function updateSession() {
  userLogged = localStorage.getItem('user') || null;
  const loginBox = document.getElementById('loginBox');
  const userBox = document.getElementById('userBox');
  const welcome = document.getElementById('welcomeUser');

  if (userLogged) {
    if (loginBox) loginBox.classList.add('hidden');
    if (userBox) userBox.classList.remove('hidden');
    if (welcome) welcome.textContent = `Hola, ${userLogged}`;
  } else {
    if (loginBox) loginBox.classList.remove('hidden');
    if (userBox) userBox.classList.add('hidden');
    if (welcome) welcome.textContent = '';
  }
}

function showLoginBox() {
  const loginBox = document.getElementById('loginBox');
  const userBox = document.getElementById('userBox');
  if (loginBox) loginBox.classList.remove('hidden');
  if (userBox) userBox.classList.add('hidden');
  const emailField = document.getElementById('email');
  if (emailField) emailField.focus();
}