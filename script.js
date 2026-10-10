// ===========================================
 // BESTIARIO DE HALLOWNEST
 // Hollow Knight SPA
 // ===========================================

let personajesHollowKnight = [];
let offset = 0;
const limite = 20;

// Elementos HTML
const pokemonContainer = document.getElementById("creatureContainer");
const pokemonCounter = document.getElementById("creatureCounter");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const detailContainer = document.getElementById("detailContainer");
const mapContainer = document.getElementById("mapContainer");
const themeButton = document.getElementById("themeButton");
const randomButton = document.getElementById("randomBtn");

// ===========================================
// FAVORITOS ◇
// ===========================================

let favoritos = [];

try {
    const guardados = JSON.parse(
        localStorage.getItem("favoritosHK") || "[]"
    );

    if (Array.isArray(guardados)) {
        favoritos = guardados.map(String);
    }
} catch (error) {
    console.warn("No se pudieron cargar los favoritos", error);
}

let mostrarSoloFavoritos = false;

function guardarFavoritos() {
    localStorage.setItem(
        "favoritosHK",
        JSON.stringify(favoritos)
    );
}

function obtenerPersonajesVisibles() {
    if (!mostrarSoloFavoritos) {
        return personajesHollowKnight;
    }

    return personajesHollowKnight.filter(personaje =>
        favoritos.includes(String(personaje.id))
    );
}

// Botón para filtrar favoritos
const favoritesFilter = document.createElement("button");
favoritesFilter.className = "favorites-filter";
favoritesFilter.textContent = "◇ Ver favoritos";

if (pokemonContainer) {
    pokemonContainer.before(favoritesFilter);
}

favoritesFilter.addEventListener("click", () => {
    mostrarSoloFavoritos = !mostrarSoloFavoritos;
    offset = 0;

    favoritesFilter.textContent = mostrarSoloFavoritos
        ? "◆ Mostrar todos"
        : "◆ Ver favoritos";

    if (searchInput) searchInput.value = "";

    cargarPokemon();
});

// ===========================================
// MODO CLARO Y OSCURO
// ===========================================

if (themeButton) {
    const temaGuardado = localStorage.getItem("tema");

    if (temaGuardado === "claro") {
        document.body.classList.add("light-mode");
        themeButton.textContent = "☼";
    } else {
        document.body.classList.remove("light-mode");
        themeButton.textContent = "☽";
    }

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        const modoClaro =
            document.body.classList.contains("light-mode");

        themeButton.textContent = modoClaro ? "☼" : "☽";
        localStorage.setItem(
            "tema",
            modoClaro ? "claro" : "oscuro"
        );
    });
}

// ===========================================
// CARGA Y MENSAJES
// ===========================================

function mostrarLoading() {
    if (loading) loading.classList.remove("hidden");
}

function ocultarLoading() {
    if (loading) loading.classList.add("hidden");
}

function mostrarError(mensaje) {
    if (!errorMessage) return;

    errorMessage.textContent = mensaje;
    errorMessage.classList.remove("hidden");

    setTimeout(() => {
        errorMessage.classList.add("hidden");
    }, 2500);
}

// ===========================================
// MOSTRAR PERSONAJES Y PAGINACIÓN
// ===========================================

function cargarPokemon() {
    if (!pokemonContainer) return;

    mostrarLoading();
    pokemonContainer.innerHTML = "";

    const lista = obtenerPersonajesVisibles();

    if (offset >= lista.length && offset > 0) {
        offset = Math.max(
            0,
            Math.floor((lista.length - 1) / limite) * limite
        );
    }

    const pagina = lista.slice(offset, offset + limite);

    if (pokemonCounter) {
        pokemonCounter.textContent = `${lista.length} personajes`;
    }

    pagina.forEach(personaje => crearCard(personaje));

    if (previousBtn) {
        previousBtn.disabled = offset === 0;
    }

    if (nextBtn) {
        nextBtn.disabled = offset + limite >= lista.length;
    }

    renderizarMapa(personajesHollowKnight);
    ocultarLoading();
}

// ===========================================
// CREAR TARJETAS
// ===========================================

function crearCard(personaje) {
    if (!pokemonContainer) return;

    const card = document.createElement("article");
    card.className = "card";

    const id = String(personaje.id);
    const esFavorito = favoritos.includes(id);

    const imagen = document.createElement("img");
    imagen.src = personaje.imagen || "";
    imagen.alt = personaje.nombre || "Personaje";
    imagen.loading = "lazy";

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body";

    const numero = document.createElement("p");
    numero.className = "id";
    numero.textContent = `#${personaje.id}`;

    const nombre = document.createElement("h3");
    nombre.textContent = personaje.nombre || "Sin nombre";

    const tipo = document.createElement("span");
    tipo.className = "tipo";
    tipo.textContent = personaje.tipo || "";

    const favoritoBtn = document.createElement("button");
    favoritoBtn.className = "favorite-btn";
    favoritoBtn.textContent = esFavorito
        ? "◆ Guardado"
        : "◇ Guardar";

    favoritoBtn.addEventListener("click", () => {
        if (favoritos.includes(id)) {
            favoritos = favoritos.filter(item => item !== id);
        } else {
            favoritos.push(id);
        }

        guardarFavoritos();

        if (mostrarSoloFavoritos) {
            cargarPokemon();
        } else {
            favoritoBtn.textContent = favoritos.includes(id)
                ? "◆ Guardado"
                : "◇ Guardar";
        }
    });

    const detalleBtn = document.createElement("button");
    detalleBtn.className = "ver-detalle";
    detalleBtn.textContent = "Ver información";

    detalleBtn.addEventListener("click", () => {
        mostrarDetalle(personaje);
    });

    cuerpo.append(numero, nombre, tipo, favoritoBtn, detalleBtn);
    card.append(imagen, cuerpo);
    pokemonContainer.appendChild(card);
}
// ===========================================
 // MAPA INTERACTIVO
 // ===========================================

function renderizarMapa(personajes) {
    if (!mapContainer) return;

    mapContainer.querySelectorAll(".map-pin").forEach(pin => {
        pin.remove();
    });

    personajes.forEach(personaje => {
        if (!personaje.coords) return;

        const pin = document.createElement("button");
        pin.className = "map-pin";
        pin.title = personaje.nombre || "";

        pin.style.left = `${personaje.coords.x}%`;
        pin.style.top = `${personaje.coords.y}%`;

        const imagen = document.createElement("img");
        imagen.src = personaje.imagen || "";
        imagen.alt = personaje.nombre || "";

        pin.appendChild(imagen);

        pin.addEventListener("click", () => {
            mostrarDetalle(personaje);
        });

        mapContainer.appendChild(pin);
    });
}

// ===========================================
// DETALLES DEL PERSONAJE
// ===========================================

function mostrarDetalle(personaje) {
    if (!detailContainer) return;

    detailContainer.innerHTML = "";

    const imagen = document.createElement("img");
    imagen.src = personaje.imagen || "";
    imagen.alt = personaje.nombre || "";

    const nombre = document.createElement("h2");
    nombre.textContent = personaje.nombre || "Sin nombre";

    const numero = document.createElement("p");
    numero.textContent = `#${personaje.id}`;

    const tipo = document.createElement("p");
    tipo.textContent = `Tipo: ${personaje.tipo || "Desconocido"}`;

    const descripcion = document.createElement("p");
    descripcion.textContent =
        personaje.descripcion || "Sin descripción disponible.";

    detailContainer.append(
        imagen,
        nombre,
        numero,
        tipo,
        descripcion
    );

    // ALTURA Y PESO
    const altura = document.createElement("p");
    altura.textContent =
        `Altura: ${personaje.altura ?? "Desconocida"}`;

    const peso = document.createElement("p");
    peso.textContent =
        `Peso: ${personaje.peso ?? "Desconocido"}`;

    detailContainer.append(altura, peso);

    // HABILIDADES
    if (Array.isArray(personaje.habilidades)) {
        const tituloHabilidades = document.createElement("h3");
        tituloHabilidades.textContent = "Habilidades";

        const listaHabilidades = document.createElement("ul");

        personaje.habilidades.forEach(habilidad => {
            const elemento = document.createElement("li");

            elemento.textContent =
                typeof habilidad === "string"
                    ? habilidad
                    : habilidad.nombre || habilidad.name || "Habilidad";

            listaHabilidades.appendChild(elemento);
        });

        detailContainer.append(
            tituloHabilidades,
            listaHabilidades
        );
    }

    // ESTADÍSTICAS
    if (Array.isArray(personaje.stats)) {
        const tituloStats = document.createElement("h3");
        tituloStats.textContent = "Estadísticas";

        detailContainer.appendChild(tituloStats);

        personaje.stats.forEach(stat => {
            const fila = document.createElement("p");

            if (typeof stat === "object" && stat !== null) {
                const nombreStat =
                    stat.nombre ||
                    stat.name ||
                    stat.stat?.name ||
                    "Estadística";

                const valorStat =
                    stat.valor ??
                    stat.value ??
                    stat.base_stat ??
                    "—";

                fila.textContent =
                    `${capitalizar(nombreStat)}: ${valorStat}`;
            } else {
                fila.textContent = String(stat);
            }

            detailContainer.appendChild(fila);
        });
    }

    detailContainer.classList.remove("hidden");

    detailContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
// ===========================================
// BUSCADOR
// ===========================================

function buscarPokemon() {
    if (!searchInput || !pokemonContainer) return;

    const texto = searchInput.value.trim().toLowerCase();

    if (!texto) {
        offset = 0;
        cargarPokemon();
        return;
    }

    const resultados = obtenerPersonajesVisibles().filter(personaje =>
        (personaje.nombre || "").toLowerCase().includes(texto)
    );

    pokemonContainer.innerHTML = "";

    if (resultados.length === 0) {
        if (pokemonCounter) {
            pokemonCounter.textContent = "0 personajes";
        }

        mostrarError("No se encontró ningún personaje.");
        return;
    }

    resultados.forEach(personaje => crearCard(personaje));

    if (pokemonCounter) {
        pokemonCounter.textContent =
            `${resultados.length} resultado(s)`;
    }

    renderizarMapa(resultados);
}

if (searchButton) {
    searchButton.addEventListener("click", buscarPokemon);
}

if (searchInput) {
    searchInput.addEventListener("keydown", evento => {
        if (evento.key === "Enter") buscarPokemon();
    });
}

// ===========================================
// BOTONES DE PÁGINAS
// ===========================================

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        if (
            offset + limite <
            obtenerPersonajesVisibles().length
        ) {
            offset += limite;
            cargarPokemon();
        }
    });
}

if (previousBtn) {
    previousBtn.addEventListener("click", () => {
        offset = Math.max(0, offset - limite);
        cargarPokemon();
    });
}
// ===========================================
// PERSONAJE ALEATORIO
// ===========================================

function capitalizar(texto = "") {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

if (randomButton) {
    randomButton.addEventListener("click", () => {
        if (personajesHollowKnight.length === 0) {
            mostrarError("Todavía no se cargaron los personajes.");
            return;
        }

        const lista = obtenerPersonajesVisibles();

        if (lista.length === 0) {
            mostrarError("No hay favoritos para elegir.");
            return;
        }

        const indice = Math.floor(Math.random() * lista.length);
        mostrarDetalle(lista[indice]);
    });
}

// ===========================================
// CARGAR EL ARCHIVO JSON
// ===========================================

fetch("personajes.json")
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar personajes.json");
        }

        return respuesta.json();
    })
    .then(datos => {
        if (!Array.isArray(datos)) {
            throw new Error("El JSON no contiene una lista válida.");
        }

        personajesHollowKnight = datos;
        cargarPokemon();
    })
    .catch(error => {
        console.error("Error cargando el bestiario:", error);
        ocultarLoading();
        mostrarError("Error al cargar personajes.json.");
    });

    const randomBtn = document.getElementById("randomBtn");

if (randomButton) {
    randomButton.addEventListener("click", () => {
        const lista = obtenerPersonajesVisibles();

        if (lista.length === 0) {
            mostrarError("No hay personajes disponibles.");
            return;
        }

        const indice = Math.floor(Math.random() * lista.length);
        mostrarDetalle(lista[indice]);
    });
}
