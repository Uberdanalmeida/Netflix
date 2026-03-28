// --- LÓGICA COMPARTILHADA / INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Verifica se está na página de seleção de perfis
  const mainContainer = document.querySelector(".profile-gate-container");
  if (mainContainer) {
    configurarSelecaoPerfis(mainContainer);
  }

  // 2. Verifica se está no catálogo (procurando o container de filmes)
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
      // Efeito de saída
      container.style.transition = "opacity 0.5s ease";
      container.style.opacity = "0";

      // Criar Loader simples
      const loader = document.createElement("div");
      loader.className = "netflix-loader";
      document.body.appendChild(loader);

      setTimeout(() => {
        window.location.href = "catalogo.html";
      }, 1000);
    });
  });
}

// --- FUNÇÕES DO CATÁLOGO (API TMDB) ---
async function iniciarCatalogo() {
  console.log("Iniciando carregamento do catálogo...");
  
  // Chamamos o banner e as fileiras de forma independente
  // Se o banner der erro, ele não impede os filmes de aparecerem
  carregarBannerDinamico(requests.trending);
  getMovies(requests.trending, 'trending-movies');
  getMovies(requests.originals, 'popular-series');
}

async function carregarBannerDinamico(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if(!data.results || data.results.length === 0) return;

        // Escolhe um filme aleatório
        const filmeAleatorio = data.results[Math.floor(Math.random() * data.results.length)];
        
        const banner = document.querySelector('.featured-banner');
        const titulo = document.getElementById('banner-title');
        const descricao = document.getElementById('banner-description');

        // IMPORTANTE: Aqui usamos o backdrop_path para o fundo
        // Usamos uma URL de alta qualidade (original) se possível
        const backdropUrl = filmeAleatorio.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${filmeAleatorio.backdrop_path}` 
            : "";

        if(banner && backdropUrl) {
            banner.style.backgroundImage = `linear-gradient(to right, #141414 10%, rgba(20, 20, 20, 0) 50%), url('${backdropUrl}')`;
        }

        // Preenche os textos apenas se os elementos existirem no HTML
        if(titulo) titulo.innerText = filmeAleatorio.title || filmeAleatorio.name;
        if(descricao) descricao.innerText = trancarTexto(filmeAleatorio.overview, 150);

    } catch (error) {
        console.error("Erro ao carregar o banner:", error);
    }
}

async function getMovies(url, elementId) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const displayContainer = document.getElementById(elementId);

    if(!displayContainer || !data.results) return;

    // Limpa o container antes de adicionar (evita duplicados)
    displayContainer.innerHTML = "";

    data.results.forEach(movie => {
      const card = document.createElement('div');
      card.classList.add('card');
      
      // IMG_URL vem do seu api.js
      const imagePath = movie.poster_path 
        ? IMG_URL + movie.poster_path 
        : 'https://via.placeholder.com/200x300?text=Sem+Imagem';
      
      card.innerHTML = `<img src="${imagePath}" alt="${movie.title || movie.name}" title="${movie.title || movie.name}">`;
      displayContainer.appendChild(card);
    });
    
    console.log(`Sucesso: ${elementId} carregado.`);
  } catch (error) {
    console.error(`Erro ao buscar filmes para ${elementId}:`, error);
  }
}

function trancarTexto(texto, maxChars) {
    if(!texto) return "";
    return texto.length > maxChars ? texto.substr(0, maxChars - 1) + '...' : texto;
}

function scrollRow(elementId, direction) {
  const row = document.getElementById(elementId);
  // Calcula quanto scrollar (largura de uns 3 cards)
  const scrollAmount = row.clientWidth * 0.8; 
  
  row.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}