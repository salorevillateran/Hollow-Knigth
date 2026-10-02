// ===========================================
// BUSCADOR DE ALMAS SPA (HOLLOW KNIGHT)
// Datos locales
// ===========================================

// ==============================
// BASE DE DATOS LOCAL DE PERSONAJES
// ==============================

let personajesHollowKnight = [];


// ==============================
// VARIABLES
// ==============================

let offset = 0;
const limite = 20;


// ==============================
// ELEMENTOS DEL DOM
// ==============================

const pokemonContainer = document.getElementById("creatureContainer");
const pokemonCounter = document.getElementById("creatureCounter");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const detailContainer = document.getElementById("detailContainer");


// ==============================
// MODO CLARO / OSCURO
// ==============================

const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        themeButton.textContent = "☼";

        localStorage.setItem("tema", "claro");

    } else {

        themeButton.textContent = "☽";

        localStorage.setItem("tema", "oscuro");

    }

});


// ==============================
// RECORDAR TEMA
// ==============================

const temaGuardado = localStorage.getItem("tema");

if (temaGuardado === "claro") {

    document.body.classList.add("light-mode");

    themeButton.textContent = "☼";

}


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

    setTimeout(() => {

        const personajesPagina =
            personajesHollowKnight.slice(
                offset,
                offset + limite
            );

        pokemonCounter.textContent =
            `${personajesHollowKnight.length} Personajes`;

        if (
            personajesPagina.length === 0 &&
            offset > 0
        ) {

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

        <img
            src="${personaje.imagen}"
            alt="${personaje.nombre}"
        >

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

    card.querySelector("button")
        .addEventListener("click", () => {

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

                <span
                    style="width:${Math.min(stat.base_stat * 10, 100)}%">
                </span>

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

        <img
            src="${personaje.imagen}"
            alt="${personaje.nombre}"
        >

        <h2>
            ${personaje.nombre}
        </h2>

        <h3>
            #${personaje.id}
        </h3>

        <div>

            <span class="tipo">
                ${personaje.tipo}
            </span>

        </div>

        <p class="descripcion">

            ${personaje.descripcion}

        </p>

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

    const textoBusqueda =
        searchInput.value.trim().toLowerCase();

    if (textoBusqueda === "") {

        cargarPokemon();

        return;

    }

    mostrarLoading();

    setTimeout(() => {

        const encontrado =
            personajesHollowKnight.find(
                p =>
                    p.nombre
                        .toLowerCase() === textoBusqueda
            );

        pokemonContainer.innerHTML = "";

        if (encontrado) {

            crearCard(encontrado);

            mostrarDetalle(encontrado);

            pokemonCounter.textContent =
                "1 Personaje";

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

searchButton.addEventListener(
    "click",
    buscarPokemon
);

searchInput.addEventListener(
    "keypress",
    e => {

        if (e.key === "Enter") {

            buscarPokemon();

        }

    }
);


// ==============================
// PAGINACIÓN
// ==============================

nextBtn.addEventListener("click", () => {

    if (
        offset + limite >=
        personajesHollowKnight.length
    ) return;

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

    return texto.charAt(0).toUpperCase()
        + texto.slice(1);

}


// ==============================
// INICIO
// ==============================

fetch("personajes.json")

    .then(response => response.json())

    .then(datos => {

        personajesHollowKnight = datos;

        cargarPokemon();

    })

    .catch(error => {

        console.error(error);

        mostrarError(
            "No se pudieron cargar las criaturas"
        );

    });
