document.addEventListener('DOMContentLoaded', () => {
    const profileLinks = document.querySelectorAll('.profile-link');
    const mainContainer = document.querySelector('.profile-gate-container');

    profileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 1. Evita que o link mude de página instantaneamente
            e.preventDefault();
            
            // 2. Pega o nome do perfil clicado
            const profileName = link.querySelector('figcaption').innerText;
            const targetUrl = link.getAttribute('href');

            // 3. Inicia a transição de "Entrada"
            selecionarPerfil(profileName, targetUrl);
        });
    });

    function selecionarPerfil(nome, url) {
        // Adiciona um efeito de fade out no container de perfis
        mainContainer.style.transition = 'opacity 0.5s ease';
        mainContainer.style.opacity = '0';

        // Cria o elemento de Loading da Netflix
        const loader = document.createElement('div');
        loader.className = 'netflix-loader';
        document.body.appendChild(loader);

        console.log(`Entrando como: ${nome}...`);

        setTimeout(() => {
    // Agora sim, redirecionamos para o catálogo!
    window.location.href = "catalogo.html"; 
}, 1500);
    }
});