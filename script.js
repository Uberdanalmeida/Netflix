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
                // 1. Seleciona a lista correta (profile-list)
                const listaPerfis = document.querySelector(".profile-list");
                
                // 2. Cria o novo item li
                const novoItem = document.createElement("li");
                novoItem.className = "profile-item";
                
                // 3. Monta o HTML com a tag <figure> e <figcaption> igual aos outros
                novoItem.innerHTML = `
                    <a href="#" class="profile-link">
                        <figure class="profile-avatar">
                            <img src="assets/perfil-1.png" alt="Avatar de ${novoNome}" />
                            <figcaption>${novoNome}</figcaption>
                        </figure>
                    </a>
                `;
                
                // 4. Insere na tela antes do botão de adicionar
                listaPerfis.insertBefore(novoItem, btnAdicionar);
                
                // 5. Faz o novo perfil funcionar ao ser clicado
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
    // 1. Recupera os dados salvos
    const nomeLogado = localStorage.getItem("perfilNome");
    const imgLogada = localStorage.getItem("perfilImg");

    // 2. Troca os dados do Uberdan pelos do perfil escolhido
    if (nomeLogado) {
        const navNome = document.querySelector(".nav-right span");
        const navImg = document.querySelector(".nav-avatar");
        if (navNome) navNome.innerText = nomeLogado;
        if (navImg && imgLogada) navImg.src = imgLogada;
    }

    console.log("Iniciando busca de filmes na API...");
    carregarBannerDinamico(requests.trending);
    getMovies(requests.trending, 'trending-movies');
    getMovies(requests.originals, 'popular-series');
}

async function carregarBannerDinamico(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) return;

    // Escolhe um filme aleatório
    const filmeAleatorio =
      data.results[Math.floor(Math.random() * data.results.length)];

    const banner = document.querySelector(".featured-banner");
    const titulo = document.getElementById("banner-title");
    const descricao = document.getElementById("banner-description");

    // IMPORTANTE: Aqui usamos o backdrop_path para o fundo
    // Usamos uma URL de alta qualidade (original) se possível
    const backdropUrl = filmeAleatorio.backdrop_path
      ? `https://image.tmdb.org/t/p/original${filmeAleatorio.backdrop_path}`
      : "";

    if (banner && backdropUrl) {
      banner.style.backgroundImage = `linear-gradient(to right, #141414 10%, rgba(20, 20, 20, 0) 50%), url('${backdropUrl}')`;
    }

    // Preenche os textos apenas se os elementos existirem no HTML
    if (titulo) titulo.innerText = filmeAleatorio.title || filmeAleatorio.name;
    if (descricao)
      descricao.innerText = trancarTexto(filmeAleatorio.overview, 150);
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
  const modal = document.getElementById("movie-modal");

  // Limpa o vídeo da abertura anterior para não misturar som
  const videoContainer = document.getElementById("modal-video-container");
  videoContainer.innerHTML = "";
  videoContainer.style.display = "none";
  document.getElementById("modal-banner").style.display = "block";

  // Preenche os textos (como você já fazia)
  document.getElementById("modal-title").innerText = movie.title || movie.name;
  document.getElementById("modal-overview").innerText =
    movie.overview || "Sinopse não disponível.";

  const imgUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";
  document.getElementById("modal-banner").style.backgroundImage =
    `url('${imgUrl}')`;

  // --- NOVA LINHA: Chama a busca do trailer ---
  const tipo = movie.first_air_date ? "tv" : "movie";
  buscarTrailer(movie.id, tipo);

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

  // O 'type' ajuda a diferenciar se é 'movie' ou 'tv' (importante para a API)
  const category = type === "tv" ? "tv" : "movie";
  const url = `${BASE_URL}/${category}/${movieId}/videos?api_key=${API_KEY}&language=pt-BR`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Procuramos por um vídeo que seja do YouTube e do tipo 'Trailer'
    const trailer = data.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer",
    );

    if (trailer) {
      videoContainer.style.display = "block";
      banner.style.display = "none"; // ESCONDE O BANNER SE TIVER VÍDEO
      banner.classList.add("hidden"); // Esconde a imagem estática
      // Dentro da função buscarTrailer, onde você define o innerHTML:
      videoContainer.innerHTML = `
    <iframe 
        src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&enablejsapi=1&origin=${window.location.origin}" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>`;
    } else {
      videoContainer.style.display = "none";
      banner.style.display = "block"; // MOSTRA O BANNER SE NÃO TIVER VÍDEO
      banner.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Erro ao buscar trailer:", error);
  }
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
