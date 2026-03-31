// --- LÓGICA COMPARTILHADA / INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Verifica se está na página de seleção de perfis
  const mainContainer = document.querySelector(".profile-gate-container");
  if (mainContainer) {
    configurarSelecaoPerfis(mainContainer);
  }

  // 2. Verifica se está no catálogo (procurando o container de filmes)
  const trendingContainer = document.getElementById("trending-movies");
  if (trendingContainer) {
    iniciarCatalogo();
  }

  const closeBtn = document.querySelector(".close-modal");
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        document.getElementById("movie-modal").style.display = "none";
        document.body.style.overflow = "auto";
        document.getElementById("modal-video-container").innerHTML = "";
    });
}
});

// --- FUNÇÕES DA TELA DE PERFIS ---
function configurarSelecaoPerfis(container) {
    const profileLinks = document.querySelectorAll(".profile-link");
    const btnAdicionar = document.getElementById("btn-adicionar-perfil");

    // Lógica para perfis existentes
    profileLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const nomeValue = link.querySelector("figcaption").innerText;
            const imgPath = link.querySelector("img").src;
            
            // Salva e Redireciona
            localStorage.setItem("perfilNome", nomeValue);
            localStorage.setItem("perfilImg", imgPath);
            window.location.href = "catalogo.html";
        });
    });

    // Lógica para ADICIONAR (Corrigida para seu HTML)
    if (btnAdicionar) {
    btnAdicionar.onclick = () => {
        const novoNome = prompt("Digite o nome do novo perfil:");
        
        if (novoNome && novoNome.trim() !== "") {
            const listaPerfis = document.querySelector(".profile-list");
            
            const novoItem = document.createElement("li");
            novoItem.className = "profile-item";
            
            // --- O SEGREDO ESTÁ AQUI ---
            // Usamos a API DiceBear para gerar uma imagem baseada no nome
            // Isso cria uma imagem única para Maria, Fulano, etc.
            const avatarNeutroUrl = `https://api.dicebear.com/8.x/identicon/svg?seed=${novoNome}`;
            
            novoItem.innerHTML = `
                <a href="#" class="profile-link">
                    <figure class="profile-avatar">
                        <img src="${avatarNeutroUrl}" alt="Avatar de ${novoNome}" />
                        <figcaption>${novoNome}</figcaption>
                    </figure>
                </a>
            `;
            
            listaPerfis.insertBefore(novoItem, btnAdicionar);
            
            const novoLink = novoItem.querySelector(".profile-link");
            vincularClickPerfil(novoLink); 
        }
    };
}
}

// Função para garantir que novos perfis também redirecionem
function vincularClickPerfil(link) {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const nome = link.querySelector("figcaption").innerText;
        const img = link.querySelector("img").src;
        
        localStorage.setItem("perfilNome", nome);
        localStorage.setItem("perfilImg", img);
        
        window.location.href = "catalogo.html";
    });
}

// --- FUNÇÕES DO CATÁLOGO (API TMDB) ---
async function iniciarCatalogo() {
    // 1. Recupera os dados salvos no localStorage
    const nomeLogado = localStorage.getItem("perfilNome");
    const imgLogada = localStorage.getItem("perfilImg");

    // 2. Seleciona os elementos pelos NOVOS IDs do seu HTML
    const navNome = document.getElementById("nav-user-name");
    const navImg = document.getElementById("nav-user-img");

    // 3. Aplica os dados se eles existirem na memória
    if (nomeLogado && navNome) {
        navNome.innerText = nomeLogado;
    }
    
    if (imgLogada && navImg) {
        navImg.src = imgLogada;
    }

    // --- BUSCA DE FILMES (TMDB) ---
    console.log("Iniciando busca de filmes na API...");
    carregarBannerDinamico(requests.trending);
    getMovies(requests.trending, 'trending-movies');
    getMovies(requests.originals, 'popular-series');

    // --- LÓGICA DE CLIQUE PARA VOLTAR/TROCAR PERFIL ---
    const profileTrigger = document.getElementById("profile-menu-trigger");

    if (profileTrigger) {
        profileTrigger.addEventListener("click", () => {
            // Apenas redireciona para a tela de perfis
            window.location.href = "index.html";
        });
    }

    // --- LÓGICA DE FILTROS COM SCROLL ---

// Filtro de Séries
const btnSeries = document.getElementById("nav-series");
if (btnSeries) {
    btnSeries.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".movie-row h2").innerText = "Séries de TV";
        getMovies(requests.fetchTvShows, 'trending-movies');
        // ADICIONADO:
        window.scrollTo({ top: 500, behavior: 'smooth' }); 
    });
}

// Filtro de Filmes
const btnMovies = document.getElementById("nav-movies");
if (btnMovies) {
    btnMovies.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".movie-row h2").innerText = "Filmes";
        getMovies(requests.fetchMovies, 'trending-movies');
        // ADICIONADO:
        window.scrollTo({ top: 500, behavior: 'smooth' });
    });
}

// Voltar ao Início
const btnHome = document.getElementById("nav-home");
if (btnHome) {
    btnHome.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".movie-row h2").innerText = "Filmes em Alta";
        getMovies(requests.trending, 'trending-movies');
        // ADICIONADO:
        window.scrollTo({ top: 500, behavior: 'smooth' });
    });
}

// Dentro de iniciarCatalogo()
const btnPlayBanner = document.querySelector(".featured-buttons .btn-play");
const btnInfoBanner = document.querySelector(".featured-buttons .btn-info");

if(btnPlayBanner) btnPlayBanner.onclick = () => filmeBannerAtual && abrirModal(filmeBannerAtual);
if(btnInfoBanner) btnInfoBanner.onclick = () => filmeBannerAtual && abrirModal(filmeBannerAtual);
}

let filmeBannerAtual = null; // Variável global no script.js

async function carregarBannerDinamico(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.results || data.results.length === 0) return;

        const filmeAleatorio = data.results[Math.floor(Math.random() * data.results.length)];
        filmeBannerAtual = filmeAleatorio; 

        const banner = document.querySelector(".featured-banner");
        const backdropUrl = filmeAleatorio.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${filmeAleatorio.backdrop_path}` 
            : "";

        if (banner && backdropUrl) {
            banner.style.backgroundImage = `linear-gradient(to right, #141414 10%, rgba(20, 20, 20, 0) 50%), url('${backdropUrl}')`;
        }

        document.getElementById("banner-title").innerText = filmeAleatorio.title || filmeAleatorio.name;
        document.getElementById("banner-description").innerText = trancarTexto(filmeAleatorio.overview, 150);
        
    } catch (error) {
        console.error("Erro ao carregar o banner:", error);
    }
}

async function getMovies(url, elementId) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const displayContainer = document.getElementById(elementId);

    if (!displayContainer || !data.results) return;

    // Limpa o container antes de adicionar (evita duplicados)
    displayContainer.innerHTML = "";

    data.results.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("card");

      // IMG_URL vem do seu api.js
      const imagePath = movie.poster_path
        ? IMG_URL + movie.poster_path
        : "https://via.placeholder.com/200x300?text=Sem+Imagem";

      card.innerHTML = `<img src="${imagePath}" alt="${movie.title || movie.name}" title="${movie.title || movie.name}">`;
      displayContainer.appendChild(card);

      // Dentro do data.results.forEach no seu getMovies:
      card.addEventListener("click", () => abrirModal(movie));
    });

    console.log(`Sucesso: ${elementId} carregado.`);
  } catch (error) {
    console.error(`Erro ao buscar filmes para ${elementId}:`, error);
  }
}

function trancarTexto(texto, maxChars) {
  if (!texto) return "";
  return texto.length > maxChars
    ? texto.substr(0, maxChars - 1) + "..."
    : texto;
}

function scrollRow(elementId, direction) {
  const row = document.getElementById(elementId);
  // Calcula quanto scrollar (largura de uns 3 cards)
  const scrollAmount = row.clientWidth * 0.8;

  row.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

// Efeito de Scroll na Navbar
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav-catalogo");

  // Se o scroll passar de 100px, adiciona a classe 'black', senão remove
  if (window.scrollY > 100) {
    nav.classList.add("black");
  } else {
    nav.classList.remove("black");
  }
});

function abrirModal(movie) {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Faz a página subir suavemente
    const modal = document.getElementById("movie-modal");
    const videoContainer = document.getElementById("modal-video-container");
    const banner = document.getElementById("modal-banner");

    // 1. Limpeza e Reset
    videoContainer.innerHTML = "";
    videoContainer.style.display = "none";
    banner.style.display = "block";
    banner.classList.remove("hidden");

    // 2. Preenchimento de Textos e Imagem
    document.getElementById("modal-title").innerText = movie.title || movie.name;
    document.getElementById("modal-overview").innerText = movie.overview || "Sinopse não disponível.";
    
    const imgUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "";
    banner.style.backgroundImage = `url('${imgUrl}')`;

    // 3. Metadados (Ano e Relevância)
    const dataLancamento = movie.release_date || movie.first_air_date || "";
    document.getElementById("modal-year").innerText = dataLancamento.split("-")[0] || "N/A";

    const relevancia = Math.round(movie.vote_average * 10);
    const campoRelevancia = document.getElementById("modal-average");
    campoRelevancia.innerText = `${relevancia}% relevante`;
    campoRelevancia.style.color = relevancia > 70 ? "#46d369" : "#fff";

    // 4. Busca do Trailer
    const tipo = movie.first_air_date ? "tv" : "movie";
    buscarTrailer(movie.id, tipo);

    // 5. Exibição
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

// Lógica para fechar o modal
document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("movie-modal").style.display = "none";
  document.body.style.overflow = "auto";
  document.getElementById("modal-video-container").innerHTML = "";
});

// Fechar se clicar fora do conteúdo
window.onclick = (event) => {
  const modal = document.getElementById("movie-modal");
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.getElementById("modal-video-container").innerHTML = "";
  }
};

async function buscarTrailer(movieId, type) {
    const videoContainer = document.getElementById("modal-video-container");
    const banner = document.getElementById("modal-banner");

    // Reset total do container para forçar o navegador a esquecer o erro anterior
    videoContainer.style.display = "none";
    videoContainer.innerHTML = ""; 

    const url = `${BASE_URL}/${type === "tv" ? "tv" : "movie"}/${movieId}/videos?api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const trailer = data.results.find(v => v.site === "YouTube");

        if (trailer) {
            banner.style.display = "none";
            videoContainer.style.display = "block";

            // Criamos o elemento de forma "crua" para evitar bloqueios de script
            const playerHtml = `
                <object data="https://www.youtube.com/v/${trailer.key}?autoplay=1&mute=1" 
                        type="application/x-shockwave-flash" 
                        width="100%" height="100%">
                    <param name="movie" value="https://www.youtube.com/v/${trailer.key}?autoplay=1&mute=1" />
                    <iframe src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&enablejsapi=1" 
                            frameborder="0" style="width:100%; height:100%;"></iframe>
                </object>`;
            
            videoContainer.innerHTML = playerHtml;
        } else {
            mostrarApenasBanner(videoContainer, banner);
        }
    } catch (e) {
        mostrarApenasBanner(videoContainer, banner);
    }
}

function mostrarApenasBanner(video, banner) {
    video.style.display = "none";
    video.innerHTML = "";
    banner.style.display = "block";
    banner.classList.remove("hidden");
}

// --- LÓGICA DE BUSCA ---
const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");
const searchBox = document.querySelector(".search-box");

// Abre/Fecha a barra ao clicar na lupa
searchIcon.addEventListener("click", () => {
  searchBox.classList.toggle("active");
  if (searchBox.classList.contains("active")) {
    searchInput.focus();
  }
});

// Realiza a busca ao digitar
searchInput.addEventListener("keyup", (e) => {
  const query = e.target.value;

  if (query.length > 2) {
    // Mudamos o título da primeira fileira para "Resultados"
    document.querySelector(".movie-row h2").innerText = "Resultados da busca";

    // URL de busca do TMDB
    const searchUrl = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`;
    getMovies(searchUrl, "trending-movies");
  } else if (query.length === 0) {
    // Se apagar tudo, volta ao normal
    document.querySelector(".movie-row h2").innerText = "Filmes em Alta";
    getMovies(requests.trending, "trending-movies");
  }
});
