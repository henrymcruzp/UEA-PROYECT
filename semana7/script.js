// 1. DATOS INICIALES (Simulando base de datos)
let inventario = [
    { nombre: "Tour Amazonía 3D/2N", precio: 250, descripcion: "Selva y aventura guiada." },
    { nombre: "Escapada Baños", precio: 80, descripcion: "Ruta de las cascadas." },
    { nombre: "Full Day Cotopaxi", precio: 45, descripcion: "Visita al parque nacional." }
];

// 2. SELECCIÓN DE ELEMENTOS DEL DOM
const formulario = document.getElementById("form-paquetes");
const listaHTML = document.getElementById("lista-productos");

// 3. FUNCIÓN PARA DIBUJAR (RENDERIZAR) LA LISTA
function renderizarProductos() {
    // Limpiamos la lista para no repetir elementos viejos
    listaHTML.innerHTML = "";

    // Recorremos el arreglo
    inventario.forEach(paquete => {
        // Creamos la plantilla HTML usando Backticks (Comillas invertidas)
        // Usamos clases de CSS para que se vea bonito
        const plantilla = `
            <li class="tarjeta-producto">
                <div class="info">
                    <h3>${paquete.nombre}</h3>
                    <p>${paquete.descripcion}</p>
                </div>
                <div class="precio-tag">
                    $${paquete.precio}
                </div>
            </li>
        `;

        // Inyectamos el código en el UL
        listaHTML.innerHTML += plantilla;
    });
}

// 4. FUNCIÓN PARA AGREGAR NUEVO PAQUETE
function agregarPaquete(evento) {
    // IMPORTANTE: Evita que la página se recargue
    evento.preventDefault();

    // Capturamos lo que escribió el usuario
    const nombreInput = document.getElementById("nombre").value;
    const precioInput = document.getElementById("precio").value;
    const descInput = document.getElementById("descripcion").value;

    // Validación simple
    if (nombreInput === "" || precioInput === "") {
        alert("Por favor completa los campos");
        return;
    }

    // Creamos el nuevo objeto
    const nuevoPaquete = {
        nombre: nombreInput,
        precio: precioInput,
        descripcion: descInput
    };

    // Lo metemos al arreglo
    inventario.push(nuevoPaquete);

    // Volvemos a dibujar la lista actualizada
    renderizarProductos();

    // Limpiamos el formulario
    formulario.reset();
}

// 5. EVENTOS
// Escuchamos el envío del formulario
formulario.addEventListener("submit", agregarPaquete);

// Carga inicial al abrir la página
renderizarProductos();