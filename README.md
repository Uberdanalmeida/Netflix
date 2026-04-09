![Clone-Netflix](/assets/projeto-clone-netflix.png)

# 🎬 Netflix Clone - Portfólio
Este é um projeto de estudo que recria a interface da Netflix utilizando a API do TMDB (The Movie Database) para listar filmes e séries em tempo real. O foco principal foi o domínio de Manipulação de DOM, Consumo de APIs Assíncronas e Persistência de Dados Local.

## 🚀 Tecnologias Utilizadas
HTML5: Estrutura semântica da aplicação.

CSS3: Estilização com foco em Flexbox, Grid e Responsividade.

JavaScript (ES6+): Lógica de busca, manipulação de modal e integração com API.

TMDB API: Fonte de dados para filmes, séries e trailers.

DiceBear API: Geração dinâmica de avatares para novos perfis.

LocalStorage: Armazenamento dos perfis criados pelo usuário.

## 🚀 Funcionalidades

✅ Seleção de perfis (com criação dinâmica)  
✅ Catálogo de filmes e séries (via API TMDB)  
✅ Banner dinâmico com destaque  
✅ Modal com informações e trailer  
✅ Adicionar filmes à "Minha Lista" (localStorage)  
✅ Busca de filmes e séries  
✅ Navegação entre categorias (Início, Séries, Filmes, Minha Lista)  
✅ Interface responsiva estilo Netflix  

Gerenciamento de Perfis: Permite criar novos perfis (como "Lucas" ou "Thamirys") que ficam salvos no navegador.

Catálogo Dinâmico: Banner com filmes aleatórios e fileiras categorizadas (Trending, Originais, etc).

Sistema de Busca: Pesquisa em tempo real integrada à API.

Modal de Detalhes: Exibição de sinopse, relevância, ano de lançamento e trailer oficial (via YouTube).

Interface Responsiva: Adaptada para diferentes tamanhos de tela.


---

## 🔑 Configuração da API

Este projeto utiliza a API do TMDB.

### 1. Crie uma conta:
👉 https://www.themoviedb.org/

### 2. Gere sua API Key

### 3. No arquivo `api.js`, adicione:

```js
const API_KEY = "SUA_API_KEY_AQUI";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";