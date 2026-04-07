const API_KEY = "cb8af6fd35a9539543f42404683903eb"; // Substitua pelo seu código do TMDB
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const requests = {
  trending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=pt-BR`,
  originals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213&language=pt-BR`,
  fetchMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR`,
  fetchTvShows: `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR`,
  action: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=pt-BR`,
  comedy: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&language=pt-BR`,
  horror: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&language=pt-BR`,
  romance: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749&language=pt-BR`,
  documentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99&language=pt-BR`,
};
