
// Lista de elementos de protección personal requeridos
const equipoRequerido = [
    { nombre: "Casco", obligatorio: true },
    { nombre: "Botines", obligatorio: true },
    { nombre: "Lentes", obligatorio: true },
    { nombre: "Chaleco Reflectivo", obligatorio: true },
    { nombre: "Arnés de Seguridad", obligatorio: true }
];

// Función para generar los checkboxes en la interfaz
function generarFormulario() {
    const equipoList = document.getElementById("equipo-list");
    equipoRequerido.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "equipo-item";

        const label = document.createElement("label");
        label.textContent = item.nombre;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `equipo-${index}`;
        checkbox.dataset.nombre = item.nombre;

        div.appendChild(label);
        div.appendChild(checkbox);
        equipoList.appendChild(div);
    });
}

// Función para verificar el EPP
function verificarEPP() {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = ""; // Limpia el contenido previo

    let cumpleTodo = true;
    let mensaje = "<strong>Resultados:</strong><ul>";
    let resultadoActual = [];

    equipoRequerido.forEach((item, index) => {
        const checkbox = document.getElementById(`equipo-${index}`);
        if (checkbox.checked) {
            mensaje += `<li>${item.nombre}: En buen estado.</li>`;
            resultadoActual.push({ nombre: item.nombre, estado: "En buen estado" });
        } else {
            mensaje += `<li>${item.nombre}: FALTA o está en mal estado.</li>`;
            resultadoActual.push({ nombre: item.nombre, estado: "FALTA o está en mal estado" });
            cumpleTodo = false;
        }
    });

    mensaje += "</ul>";
    mensaje += cumpleTodo
        ? "<p style='color: green;'>¡Cumples con todos los EPP requeridos! Estás listo para trabajar.</p>"
        : "<p style='color: red;'>No cumples con todos los EPP. Por favor, completa tu equipo.</p>";

    resultadoDiv.innerHTML = mensaje;

    // Guardar resultados en el historial
    guardarEnHistorial(resultadoActual, cumpleTodo);
}

// Función para guardar los resultados en el historial (localStorage)
function guardarEnHistorial(resultado, cumpleTodo) {
    let historial = JSON.parse(localStorage.getItem("historialEPP")) || [];
    const nuevoRegistro = {
        fecha: new Date().toLocaleString(),
        resultado: resultado,
        estado: cumpleTodo ? "Cumple" : "No cumple"
    };
    historial.push(nuevoRegistro);
    localStorage.setItem("historialEPP", JSON.stringify(historial));
    mostrarHistorial();
}

// Función para mostrar el historial
function mostrarHistorial() {
    const historialDiv = document.getElementById("historial");
    historialDiv.innerHTML = ""; // Limpia el contenido previo
    const historial = JSON.parse(localStorage.getItem("historialEPP")) || [];

    if (historial.length === 0) {
        historialDiv.innerHTML = "<p>No hay registros en el historial.</p>";
        return;
    }

    historial.forEach((registro) => {
        const registroDiv = document.createElement("div");
        registroDiv.innerHTML = `
            <strong>Fecha:</strong> ${registro.fecha}<br>
            <strong>Estado:</strong> ${registro.estado}<br>
            <ul>
                ${registro.resultado.map(item => `<li>${item.nombre}: ${item.estado}</li>`).join("")}
            </ul>
            <hr>
        `;
        historialDiv.appendChild(registroDiv);
    });
}

// Función para limpiar el historial
function limpiarHistorial() {
    localStorage.removeItem("historialEPP");
    mostrarHistorial();
}

// Inicializar la interfaz
document.addEventListener("DOMContentLoaded", () => {
    generarFormulario();
    mostrarHistorial();
    document.getElementById("verificar").addEventListener("click", verificarEPP);
    document.getElementById("limpiar-historial").addEventListener("click", limpiarHistorial);
});
