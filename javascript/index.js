
async function getPokemonData(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar Pokémon. Código de status: ${response.status}`);
    }
    return response.json();
}

async function renderPokemonList(pokemonNames) {
    const pokemonList = document.getElementById('pokemonList');
    pokemonList.innerHTML = '';

    for (const name of pokemonNames) {
        try {
            const pokemonData = await getPokemonData(name);
            const li = document.createElement('li');
            li.className = 'pokemon-item';
            li.innerHTML = `
                <img src="${pokemonData.sprites.front_default}" alt="${name}" class="pokemon-img">
                <p>${name}</p>
            `;
            li.onclick = () => {
                window.location.href = `details.html?name=${name}`;
            };
            pokemonList.appendChild(li);
        } catch (error) {
            console.error(`Erro ao buscar Pokémon ${name}:`, error);
        }
    }
}

async function pesquisarPokemon() {
    const searchTerm = document.getElementById('pokemonInput').value.toLowerCase();

    if (searchTerm.trim() === '') {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const pokemonNames = data.results.map(pokemon => pokemon.name);
        renderPokemonList(pokemonNames);
    } else {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
        const data = await response.json();
        const allPokemonNames = data.results.map(pokemon => pokemon.name);
        const filteredPokemonNames = allPokemonNames.filter(name => name.includes(searchTerm));
        renderPokemonList(filteredPokemonNames);
    }
}

window.onload = async function() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await response.json();
    const pokemonNames = data.results.map(pokemon => pokemon.name);
    renderPokemonList(pokemonNames);
};