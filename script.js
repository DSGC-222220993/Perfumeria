let perfumes =[];
let favoritos =JSON.parse(localStorage.getItem("favorites")) || [];
let userLogged= localStorage.getItem("userLogged") || null;

document.addEventListener("DOMContentLoaded", function() {
    setupEventListeners();
    updateSession();
});

function setupEventListeners() {
   const loginBtn= document.getElementById("loginBtn");
   if (loginBtn) {
       loginBtn.addEventListener("click", handleLogin);
   }
   const logoutBtn= document.getElementById("logoutBtn");
   if (logoutBtn) {
       logoutBtn.addEventListener("click", handleLogout);
   }
   document.querySelectorAll(".nav a").forEach(a => {
        a.addEventListener("click", (e)=>{
            const href= a.getAttribute("href");
            if (href=="favorites") {
                if (!userLogged) showLoginBox();
                updateSession();
            }
        });
    });
    fetch('perfumes.json')
    .then(res => {
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      return res.json();
    })
    .then(data => {
      perfumes = data;
      showPopular();
      showProducts();
      showFavorites();
      console.log('Perfumes cargados:', perfumes);
    })
    .catch(err => {
      console.error('Error cargando perfumes.json:', err);
      const productList = document.getElementById('productList');
      if (productList) productList.innerHTML = '<p>Error al cargar productos. Sirve el proyecto con un servidor local.</p>';
    });
    function showPopular() {
        const popularList = document.getElementById('popularList');
        if (!popularList) return;
        popularList.innerHTML = '';
        perfumes.filter(perfume => perfume.popular).forEach(perfume => {
            popularList.innerHTML += `
                <div class="product-card">
                    <img src="${perfume.image}" alt="${perfume.name}" class="product-card__image">
                    <h4>${perfume.name}</h4>
                    <p>${perfume.brand}</p>
                </div>`;
        });
    }
    function showProducts() {
        const productList = document.getElementById('productList');
        if (!productList) return;
        productList.innerHTML = '';
        perfumes.forEach(perfume => {
            const fav= favoritos.includes(perfume.id);
            productList.innerHTML += `
                <div class="product-card">
                    <img src="${perfume.image}" alt="${perfume.name}" class="product-card__image">
                    <h4>${perfume.name}</h4>
                    <p>${perfume.brand}</p>
                    <p>$$(perfume.price)</p>

                    ${userLogged ? `
                    <button onclick="toggleFavorite(${perfume.id})" aria-label="Agregar a favoritos">
                        <img src="img/${fav ? 'ic_favoritos' : 'ic_unfavoritos'}.png" width="24" alt="${fav ? 'Favorito' : 'No favorito'}">
                    </button>` : ''}
                </div>`;
        });

    }

    function toogleFavorite(perfumeId) {
        if(!userLogged) {
            alert("Debes iniciar sesión para agregar a favoritos.");
            location.hash = "#favorites";
            showLoginBox();
            return;
        }
        if (favoritos.includes(perfumeId)) {
            favoritos = favoritos.filter(id => id !== perfumeId);
        } else {
            favoritos.push(perfumeId);
        }
        localStorage.setItem("favorites", JSON.stringify(favoritos));
        showProducts();
        showFavorites();
    }

    function showFavorites() {
        const favoriteList = document.getElementById('favoriteList');
        if (!favoriteList) return;
        favoriteList.innerHTML = '';

        if (!userLogged) {
            favoriteList.innerHTML = `
            <p>Inicia sesión para ver tus favoritos.</p>
            <button id="goLoginBtn">Iniciar sesión</button> `;
            const btn = document.getElementById('goLoginBtn');
            if (btn) btn.addEventListener('click', () => {
                location.hash = '#favorites';
                showLoginBox();
            });
            return;
        }
        const favPerfumes = perfumes.filter(perfume => favoritos.includes(perfume.id));
        if (favPerfumes.length === 0) {
            favoriteList.innerHTML = '<p>No tienes perfumes favoritos aún.</p>';
            return;
        }

         
        favs.forEach(p => {
            const fav = favorites.includes(perfumes.id);
            favoriteList.innerHTML += `
            <div class="card">
                <img src="${perfumes.image}" alt="${perfumes.name}">
                <h4>${perfumes.name}</h4>
                <p>${perfumes.brand}</p>
                <p>$${perfumes.price}</p>
                <button onclick="toggleFavorite(${perfumes.id})" aria-label="Quitar de favoritos">
                    <img src="img/${fav ? 'ic_favoritos' : 'ic_unfavoritos'}.png" width="24" alt="favorito">
                </button>
            </div>`;
        });
    }

    function handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value.trim();
        if (email || !password) {
            alert("Por favor ingresa un correo y contraseña válidos.");
            return
        }
        localStorage.setItem("userLogged", email);
        userLogged = email;
        updateSession();
        showProducts();
        showFavorites();
        location.hash = "#favorites";
    }
    function handleLogout() {
        localStorage.removeItem("userLogged");
        userLogged = null;
        updateSession();
        showProducts();
        showFavorites();
    }
    function updateSession() {
        userLogged = localStorage.getItem("userLogged") || null;
        const loginBox= document.getElementById("loginBox");
        const userBox= document.getElementById("userBox");
        const welcomeUser= document.getElementById("welcomeUser");

        if (userLogged) {
            if (loginBox) loginBox.classList.add = ("hidden");
            if (userBox) userBox.classList.remove("hidden");
            if (welcomeUser) welcomeUser.textContent = `Hola, ${userLogged}`;
        } else {
            if (loginBox) loginBox.classList.remove("hidden");
            if (userBox) userBox.classList.add("hidden");
            if (welcomeUser) welcomeUser.textContent = '';
        }
    }
    function showLoginBox() {
        const loginBox= document.getElementById("loginBox");
        const userBox= document.getElementById("userBox");
        if (loginBox) loginBox.classList.remove("hidden");
        if (userBox) userBox.classList.add("hidden");
        const emailField= document.getElementById("email");
        if (emailField) emailField.focus();
    }   

}