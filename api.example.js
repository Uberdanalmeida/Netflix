// api.example.js - O modelo (Público)

const API_KEY = 'COLOQUE_SUA_CHAVE_AQUI'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const requests = {
    trending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=pt-BR`,
    originals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213&language=pt-BR`,
    action: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=pt-BR`,
};