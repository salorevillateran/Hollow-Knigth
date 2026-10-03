// ===========================================
// BUSCADOR DE ALMAS SPA (HOLLOW KNIGHT)
// Datos locales y Mapa Interactivo
// ===========================================

// ==============================
// BASE DE DATOS Y VARIABLES
// ==============================

let personajesHollowKnight = []; // Inicializar como Array vacío
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
const mapContainer = document.getElementById("mapContainer"); // Contenedor del mapa

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

const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "claro") {
    document.body.classList.add("light-mode");
    themeButton.textContent = "☼";
}

// ==============================
// UI HELPERS (LOADING / ERROR)
// ==============================

function mostrarLoading() {
    if (loading) loading.classList.remove("hidden");
}

function ocultarLoading() {
    if (loading) loading.classList.add("hidden");
}

function mostrarError(texto = "El mapa de Cornifer no lo tiene") {
    if (!errorMessage) return;
    errorMessage.textContent = texto;
    errorMessage.classList.remove("hidden");
    setTimeout(() => {
        errorMessage.classList.add("hidden");
    }, 2500);
}

// ==============================
// RENDERIZADO DEL MAPA Y PINKS
// ==============================

function renderizarMapa(personajes) {
    if (!mapContainer) return;

    // Limpiar marcadores anteriores
    mapContainer.querySelectorAll(".map-pin").forEach(pin => pin.remove());

    personajes.forEach(personaje => {
        if (!personaje.coords) return;

        const pin = document.createElement("button");
        pin.classList.add("map-pin");
        pin.title = personaje.nombre;
        
        // Posicionamiento en porcentaje basado en el contenedor del mapa
        pin.style.left = `${personaje.coords.x}%`;
        pin.style.top = `${personaje.coords.y}%`;

        // Avatar o icono del marcador
        pin.innerHTML = `
            <img src="${personaje.imagen}" alt="${personaje.nombre}">
        `;

        pin.addEventListener("click", () => {
            mostrarDetalle(personaje);
        });

        mapContainer.appendChild(pin);
    });
}

// ==============================
// OBTENER LISTA (LOCAL)
// ==============================

function cargarPokemon() {
    mostrarLoading();

    if (pokemonContainer) pokemonContainer.innerHTML = "";

    setTimeout(() => {
        const personajesPagina = personajesHollowKnight.slice(
            offset,
            offset + limite
        );

        if (pokemonCounter) {
            pokemonCounter.textContent = `${personajesHollowKnight.length} Personajes`;
        }

        if (personajesPagina.length === 0 && offset > 0) {
            offset -= limite;
            ocultarLoading();
            cargarPokemon();
            return;
        }

        personajesPagina.forEach(personaje => {
            crearCard(personaje);
        });

        // Actualizar el mapa con los personajes actuales o visibles
        renderizarMapa(personajesHollowKnight);

        ocultarLoading();
    }, 300);
}

// ==============================
// TARJETAS
// ==============================

function crearCard(personaje) {
    if (!pokemonContainer) return;

    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
        <img src="${personaje.imagen}" alt="${personaje.nombre}">
        <div class="card-body">
            <p class="id">#${personaje.id}</p>
            <h3>${personaje.nombre}</h3>
            <span class="tipo">${personaje.tipo}</span>
            <button>Ver Información</button>
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
    if (!detailContainer) return;

    let estadisticas = "";
    if (Array.isArray(personaje.stats)) {
        personaje.stats.forEach(stat => {
            estadisticas += `
            <div class="stat">
                <div class="stat-header">
                    <span>${capitalizar(stat.stat.name)}</span>
                    <span>${stat.base_stat}</span>
                </div>
                <div class="progress">
                    <span style="width:${Math.min(stat.base_stat * 10, 100)}%"></span>
                </div>
            </div>`;
        });
    }

    let habilidades = "";
    if (Array.isArray(personaje.habilidades)) {
        personaje.habilidades.forEach(habilidad => {
            habilidades += `<li>${habilidad}</li>`;
        });
    }

    detailContainer.innerHTML = `
        <img src="${personaje.imagen}" alt="${personaje.nombre}">
        <h2>${personaje.nombre}</h2>
        <h3>#${personaje.id}</h3>
        <div><span class="tipo">${personaje.tipo}</span></div>
        <p class="descripcion">${personaje.descripcion || ''}</p>
        <p><strong>Altura:</strong> ${personaje.altura || 0} m</p>
        <p><strong>Peso:</strong> ${personaje.peso || 0} kg</p>
        <h3>Habilidades</h3>
        <ul>${habilidades}</ul>
        <div class="stats">${estadisticas}</div>
    `;

    detailContainer.scrollIntoView({ behavior: "smooth" });
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
        const encontrado = personajesHollowKnight.find(
            p => p.nombre.toLowerCase() === textoBusqueda
        );

        if (pokemonContainer) pokemonContainer.innerHTML = "";

        if (encontrado) {
            crearCard(encontrado);
            mostrarDetalle(encontrado);
            renderizarMapa([encontrado]); // Mostrar solo ese personaje en el mapa

            if (pokemonCounter) pokemonCounter.textContent = "1 Personaje";
        } else {
            mostrarError();
            cargarPokemon();
        }

        ocultarLoading();
    }, 300);
}

// ==============================
// EVENTOS Y PAGINACIÓN
// ==============================

if (searchButton) searchButton.addEventListener("click", buscarPokemon);
if (searchInput) {
    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter") buscarPokemon();
    });
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        if (offset + limite >= personajesHollowKnight.length) return;
        offset += limite;
        cargarPokemon();
    });
}

if (previousBtn) {
    previousBtn.addEventListener("click", () => {
        if (offset === 0) return;
        offset -= limite;
        cargarPokemon();
    });
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ==============================
// INICIALIZACIÓN
// ==============================

fetch("personajes.json")
    .then(response => {
        if (!response.ok) throw new Error("Error al cargar JSON");
        return response.json();
    })
    .then(datos => {
        personajesHollowKnight = datos;
        cargarPokemon();
    })
    .catch(error => {
        console.error(error);
        mostrarError("No se pudieron cargar las criaturas");
    });
