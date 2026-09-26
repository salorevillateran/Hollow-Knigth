// ===========================================
// BUSCADOR DE ALMAS SPA (HOLLOW KNIGHT)
// Datos locales
// ===========================================

// ==============================
// BASE DE DATOS LOCAL DE PERSONAJES
// ==============================
const personajesHollowKnight = [
    {
        id: 1,
        nombre: "Caballerito",
        tipo: "Abismo",
        altura: 0.3,
        peso: 5.0,
        habilidades: ["Salto de Sombra", "Venganza de los Monarcas"],
        stats: [
            { stat: { name: "vida" }, base_stat: 5 },
            { stat: { name: "ataque" }, base_stat: 10 }
        ],
        imagen: "https://static.wikia.nocookie.net/characterprofile/images/7/7b/The_Knight_%28Hollow_Knight%29.png/revision/latest?cb=20230623081057"
    },
    {
        id: 2,
        nombre: "Hornet",
        tipo: "Nido Profundo",
        altura: 1.2,
        peso: 25.0,
        habilidades: ["Aguja y Seda", "Estocada Aérea"],
        stats: [
            { stat: { name: "vida" }, base_stat: 8 },
            { stat: { name: "ataque" }, base_stat: 15 }
        ],
        imagen: "https://www.korosenai.es/wp-content/uploads/2018/02/hornet-hollow-knight.jpg"
    },
    {
        id: 3,
        nombre: "Quirrel",
        tipo: "Lago Verde",
        altura: 1.0,
        peso: 20.0,
        habilidades: ["Aguja Veloz", "Conocimiento del Monje"],
        stats: [
            { stat: { name: "vida" }, base_stat: 7 },
            { stat: { name: "ataque" }, base_stat: 12 }
        ],
        imagen: "https://static.wikia.nocookie.net/hollowknight/images/1/1c/Quirrel2.png/revision/latest?cb=20180128203223&path-prefix=es"
    },
    {
        id: 4,
        nombre: "Cornifer",
        tipo: "Sendero Verde",
        altura: 1.10,
        peso: 45.0,
        habilidades: ["Eco-localización por Tarareo", "Resistencia Ambiental"],
        stats: [
            { stat: { name: "vida" }, base_stat: 999 },
            { stat: { name: "ataque" }, base_stat: 0 }
        ],
        imagen: "https://static.wikia.nocookie.net/neutral-characters/images/f/ff/Cornifer.png/revision/latest?cb=20260225101131"
    },
    {       
        id: 5,
        nombre: "The Hollow Knight",
        tipo: "El Templo del Huevo Negro",
        altura: 2.20,
        peso: 80.0,
        habilidades: ["Triple Tajo con Aguijón", "Pilar de Infección"],
        stats: [
            { stat: { name: "vida" }, base_stat: 1250 },
            { stat: { name: "ataque" }, base_stat: 20 }
        ],
        imagen: "https://static.wikia.nocookie.net/hollowknight/images/1/12/B_Hollow_Knight.png/revision/latest?cb=20170412204859"
    },
    {       
        id: 6,
        nombre: "Menderbug",
        tipo: "Cruces Olvidados",
        altura: 0.70,
        peso: .0,
        habilidades: ["Reparación Instantánea", "Vuelo de Escape"],
        stats: [
            { stat: { name: "vida" }, base_stat: 4 },
            { stat: { name: "ataque" }, base_stat: 0 }
        ],
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_BJ9BN2PqMpFO3EwrJRAuJt0E-IjfY83XftHu2MiIeg&s=10"
    }
]

// ==============================
// VARIABLES
// ==============================

let offset = 0;
const limite = 20;

// ==============================
// ELEMENTOS DEL DOM
// ==============================

const pokemonContainer = document.getElementById("pokemonContainer");
const detailContainer = document.getElementById("detailContainer");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const pokemonCounter = document.getElementById("pokemonCounter");

// ==============================
// LOADING
// ==============================

function mostrarLoading() {
    loading.classList.remove("hidden");
}

function ocultarLoading() {
    loading.classList.add("hidden");
}

// ==============================
// ERROR
// ==============================

function mostrarError(texto = "El mapa de Conifer no lo tiene") {
    errorMessage.textContent = texto;
    errorMessage.classList.remove("hidden");

    setTimeout(() => {
        errorMessage.classList.add("hidden");
    }, 2500);
}

// ==============================
// OBTENER LISTA (LOCAL)
// ==============================

function cargarPokemon() {
    mostrarLoading();
    pokemonContainer.innerHTML = "";

    // Simulamos un pequeño respiro con setTimeout para que luzca el loading
    setTimeout(() => {
        // Cortamos la lista según el offset y el límite para la paginación
        const personajesPagina = personajesHollowKnight.slice(offset, offset + limite);

        pokemonCounter.textContent = `${personajesHollowKnight.length} Personajes`;

        if (personajesPagina.length === 0 && offset > 0) {
            offset -= limite;
            ocultarLoading();
            cargarPokemon();
            return;
        }

        personajesPagina.forEach(personaje => {
            crearCard(personaje);
        });

        ocultarLoading();
    }, 300);
}

// ==============================
// TARJETAS
// ==============================

function crearCard(personaje) {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
        <img src="${personaje.imagen}" alt="${personaje.nombre}">
        <div class="card-body">
            <p class="id">
                #${personaje.id}
            </p>
            <h3>
                ${personaje.nombre}
            </h3>
            <span class="tipo">
                ${personaje.tipo}
            </span>
            <button>
                Ver Información
            </button>
        </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
        mostrarDetalle(personaje);
    });

    pokemonContainer.appendChild(card);
}

// ==============================
// DETALLE
// ==============================

function mostrarDetalle(personaje) {
    let estadisticas = "";

    personaje.stats.forEach(stat => {
        estadisticas += `
        <div class="stat">
            <div class="stat-header">
                <span>
                    ${capitalizar(stat.stat.name)}
                </span>
                <span>
                    ${stat.base_stat}
                </span>
            </div>
            <div class="progress">
                <span style="width:${Math.min(stat.base_stat * 10, 100)}%"></span>
            </div>
        </div>
        `;
    });

    let habilidades = "";
    personaje.habilidades.forEach(habilidad => {
        habilidades += `
            <li>${habilidad}</li>
        `;
    });

    detailContainer.innerHTML = `
        <img src="${personaje.imagen}" alt="${personaje.nombre}">
        <h2>
            ${personaje.nombre}
        </h2>
        <h3>
            #${personaje.id}
        </h3>
        <div>
            <span class="tipo">${personaje.tipo}</span>
        </div>
        <p>
            <strong>Altura:</strong>
            ${personaje.altura} m
        </p>
        <p>
            <strong>Peso:</strong>
            ${personaje.peso} kg
        </p>
        <h3>
            Habilidades
        </h3>
        <ul>
            ${habilidades}
        </ul>
        <div class="stats">
            ${estadisticas}
        </div>
    `;
}

// ==============================
// BUSCAR
// ==============================

function buscarPokemon() {
    const textoBusqueda = searchInput.value.trim().toLowerCase();

    if (textoBusqueda === "") {
        cargarPokemon();
        return;
    }

    mostrarLoading();

    setTimeout(() => {
        // Buscamos coincidencia por nombre
        const encontrado = personajesHollowKnight.find(
            p => p.nombre.toLowerCase() === textoBusqueda
        );

        pokemonContainer.innerHTML = "";

        if (encontrado) {
            crearCard(encontrado);
            mostrarDetalle(encontrado);
            pokemonCounter.textContent = "1 Personaje";
        } else {
            mostrarError();
            cargarPokemon();
        }

        ocultarLoading();
    }, 300);
}

// ==============================
// EVENTOS
// ==============================

searchButton.addEventListener("click", buscarPokemon);

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        buscarPokemon();
    }
});

// ==============================
// PAGINACIÓN
// ==============================

nextBtn.addEventListener("click", () => {
    if (offset + limite >= personajesHollowKnight.length) return;
    offset += limite;
    cargarPokemon();
});

previousBtn.addEventListener("click", () => {
    if (offset === 0) return;
    offset -= limite;
    cargarPokemon();
});

// ==============================
// UTILIDADES
// ==============================

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ==============================
// INICIO
// ==============================

cargarPokemon();