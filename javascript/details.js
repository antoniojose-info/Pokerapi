async function getPokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonName = urlParams.get('name');
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    return data;
}

async function getEvolutionChain(pokemonSpeciesUrl) {
    const response = await fetch(pokemonSpeciesUrl);
    const data = await response.json();
    const evolutionChainUrl = data.evolution_chain.url;
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();
    return evolutionChainData.chain;
}


async function searchPokemonTCG(pokemonName) {
    const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}`;
    console.log(apiUrl)

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro ao buscar cartão Pokémon. Código de status: ${response.status}`);
        }

        const data = await response.json();
        displayCardDetails(data);
    } catch (error) {
        console.error(`Erro ao buscar cartão Pokémon ${pokemonName}:`, error);
    }
}

function displayCardDetails(cardData) {
    const cardDetailsContainer = document.getElementById('cardDetails');
    cardDetailsContainer.innerHTML = '';

    const cardName = document.createElement('h2');
    cardName.textContent = cardData.data[0].name;

    const cardImage = document.createElement('img');
    cardImage.src = cardData.data[0].images.small;

    cardDetailsContainer.appendChild(cardName);
    cardDetailsContainer.appendChild(cardImage);
}

async function renderDetails() {
    const pokemonDetailsContainer = document.getElementById('pokemonDetails');
    const pokemonDetails = await getPokemonDetails();

    const pokemonName = document.createElement('h2');
    pokemonName.textContent = pokemonDetails.name;

    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemonDetails.sprites.front_default;

    const pokemonHeight = document.createElement('p');
    pokemonHeight.textContent = `Altura: ${pokemonDetails.height / 10} m`;

    const pokemonWeight = document.createElement('p');
    pokemonWeight.textContent = `Peso: ${pokemonDetails.weight / 10} kg`;

    const abilities = document.createElement('p');
    abilities.textContent = `Habilidades: ${pokemonDetails.abilities.map(ability => ability.ability.name).join(', ')}`;

    const types = document.createElement('p');
    types.textContent = `Tipos: ${pokemonDetails.types.map(type => type.type.name).join(', ')}`;

    const stats = document.createElement('p');
    stats.textContent = `Status: ${pokemonDetails.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ')}`;

    const evolutionContainer = document.createElement('p');
    const evolutionChainData = await getEvolutionChain(pokemonDetails.species.url);
    
    if (evolutionChainData.evolves_to.length > 0) {
        const evolutionText = `Evolui para: ${evolutionChainData.evolves_to.map(evolution => evolution.species.name).join(', ')}`;
        evolutionContainer.textContent = evolutionText;
    } else {
        evolutionContainer.textContent = 'Não possui evoluções.';
    }

    pokemonDetailsContainer.appendChild(pokemonName);
    pokemonDetailsContainer.appendChild(pokemonImage);
    pokemonDetailsContainer.appendChild(pokemonHeight);
    pokemonDetailsContainer.appendChild(pokemonWeight);
    pokemonDetailsContainer.appendChild(abilities);
    pokemonDetailsContainer.appendChild(types);
    pokemonDetailsContainer.appendChild(stats);
    pokemonDetailsContainer.appendChild(evolutionContainer);

    // Chamada para buscar detalhes do cartão ao carregar a página de detalhes
    await searchPokemonTCG(pokemonDetails.name);
}

window.onload = async function() {
    await renderDetails();
};
