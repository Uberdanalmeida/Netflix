// --- LÓGICA COMPARTILHADA / INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
  
  // VERIFICAÇÃO: Estamos na página de SELEÇÃO DE PERFIS?
  const mainContainer = document.querySelector(".profile-gate-container");
  if (mainContainer) {
    configurarSelecaoPerfis(mainContainer);
  }

  // VERIFICAÇÃO: Estamos na página de CATÁLOGO?
  const trendingContainer = document.getElementById('trending-movies');
  if (trendingContainer) {
    iniciarCatalogo();
  }
});

// --- FUNÇÕES DA TELA DE PERFIS ---
function configurarSelecaoPerfis(container) {
  const profileLinks = document.querySelectorAll(".profile-link");

  profileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const profileName = link.querySelector("figcaption").innerText;
      
      // Efeito de saída
      container.style.transition = "opacity 0.5s ease";
      container.style.opacity = "0";

      // Criar Loader
      const loader = document.createElement("div");
      loader.className = "netflix-loader";
      document.body.appendChild(loader);

      setTimeout(() => {
        window.location.href = "catalogo.html";
      }, 1500);
    });
  });
}

// --- FUNÇÕES DO CATÁLOGO (API TMDB) ---
async function iniciarCatalogo() {
  console.log("Iniciando busca de filmes na API...");
  
  // Chamadas para a API (usando as variáveis do seu api.js)
  getMovies(requests.trending, 'trending-movies');
  getMovies(requests.originals, 'popular-series');
}

async function getMovies(url, elementId) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const displayContainer = document.getElementById(elementId);

    if(!data.results) return;

    data.results.forEach(movie => {
      const card = document.createElement('div');
      card.classList.add('card');
      
      // Garante que a URL da imagem esteja correta (IMG_URL vem do api.js)
      const imagePath = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/200x300?text=Sem+Imagem';
      
      card.innerHTML = `<img src="${imagePath}" alt="${movie.title || movie.name}">`;
      displayContainer.appendChild(card);
    });
    
    console.log(`Sucesso: ${elementId} carregado.`);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
  }
}