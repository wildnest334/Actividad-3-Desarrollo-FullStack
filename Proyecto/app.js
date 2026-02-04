// Estado de la aplicación
let descargas = [
    {
        id: '1',
        nombre: 'Ubuntu-22.04-desktop.iso',
        tamaño: '3.6 GB',
        progreso: 100,
        estado: 'completada',
        url: 'https://ubuntu.com/download',
        asignadoA: 'Juan Pérez',
        fechaCreacion: '2026-02-01'
    },
    {
        id: '2',
        nombre: 'Node.js-v20.10.0.pkg',
        tamaño: '85 MB',
        progreso: 45,
        estado: 'descargando',
        url: 'https://nodejs.org/download',
        asignadoA: 'María García',
        fechaCreacion: '2026-02-02'
    },
    {
        id: '3',
        nombre: 'VSCode-1.85.0.dmg',
        tamaño: '120 MB',
        progreso: 30,
        estado: 'pausada',
        url: 'https://code.visualstudio.com/download',
        asignadoA: 'Carlos López',
        fechaCreacion: '2026-02-03'
    }
];

let editandoId = null;

// Referencias a elementos del DOM
const form = document.getElementById('download-form');
const formTitle = document.getElementById('form-title');
const nombreInput = document.getElementById('nombre');
const asignadoAInput = document.getElementById('asignadoA');
const fechaCreacionInput = document.getElementById('fechaCreacion');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const cancelBtn = document.getElementById('cancel-btn');
const downloadsList = document.getElementById('downloads-list');

// Inicializar la aplicación
function init() {
    // Establecer fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    fechaCreacionInput.value = today;

    // Event listeners
    form.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', cancelarEdicion);

    // Renderizar lista inicial
    renderDescargas();
}

// Manejar envío del formulario
function handleSubmit(e) {
    e.preventDefault();

    const descarga = {
        nombre: nombreInput.value.trim(),
        asignadoA: asignadoAInput.value.trim(),
        fechaCreacion: fechaCreacionInput.value
    };

    if (editandoId) {
        // Editar descarga existente
        actualizarDescarga(editandoId, descarga);
    } else {
        // Agregar nueva descarga
        agregarDescarga(descarga);
    }

    limpiarFormulario();
    renderDescargas();
}

// Agregar nueva descarga
function agregarDescarga(descarga) {
    const nuevaDescarga = {
        id: Date.now().toString(),
        nombre: descarga.nombre,
        tamaño: '-',
        progreso: 0,
        estado: 'descargando',
        url: '-',
        asignadoA: descarga.asignadoA,
        fechaCreacion: descarga.fechaCreacion
    };

    descargas.unshift(nuevaDescarga);
}

// Actualizar descarga existente
function actualizarDescarga(id, descargaActualizada) {
    descargas = descargas.map(d => {
        if (d.id === id) {
            return {
                ...d,
                nombre: descargaActualizada.nombre,
                asignadoA: descargaActualizada.asignadoA,
                fechaCreacion: descargaActualizada.fechaCreacion
            };
        }
        return d;
    });
}

// Eliminar descarga
function eliminarDescarga(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta descarga?')) {
        descargas = descargas.filter(d => d.id !== id);
        renderDescargas();
    }
}

// Cambiar estado de descarga
function cambiarEstado(id, nuevoEstado) {
    descargas = descargas.map(d => {
        if (d.id === id) {
            return { ...d, estado: nuevoEstado };
        }
        return d;
    });
    renderDescargas();
}

// Iniciar edición
function iniciarEdicion(id) {
    const descarga = descargas.find(d => d.id === id);
    if (!descarga) return;

    editandoId = id;
    nombreInput.value = descarga.nombre;
    asignadoAInput.value = descarga.asignadoA;
    fechaCreacionInput.value = descarga.fechaCreacion;

    formTitle.textContent = 'Editar Descarga';
    submitText.textContent = 'Guardar Cambios';
    cancelBtn.style.display = 'flex';

    // Scroll al formulario
    form.scrollIntoView({ behavior: 'smooth' });
}

// Cancelar edición
function cancelarEdicion() {
    limpiarFormulario();
}

// Limpiar formulario
function limpiarFormulario() {
    editandoId = null;
    form.reset();
    const today = new Date().toISOString().split('T')[0];
    fechaCreacionInput.value = today;

    formTitle.textContent = 'Nueva Descarga';
    submitText.textContent = 'Agregar Descarga';
    cancelBtn.style.display = 'none';
}

// Renderizar lista de descargas
function renderDescargas() {
    // Actualizar contadores
    document.getElementById('total-count').textContent = descargas.length;
    document.getElementById('completed-count').textContent = 
        descargas.filter(d => d.estado === 'completada').length;
    document.getElementById('downloading-count').textContent = 
        descargas.filter(d => d.estado === 'descargando').length;
    document.getElementById('paused-count').textContent = 
        descargas.filter(d => d.estado === 'pausada').length;

    // Limpiar lista
    downloadsList.innerHTML = '';

    // Mostrar mensaje si no hay descargas
    if (descargas.length === 0) {
        downloadsList.innerHTML = `
            <div class="empty-state">
                <p>No hay descargas aún</p>
                <p>Agrega tu primera descarga usando el formulario arriba</p>
            </div>
        `;
        return;
    }

    // Renderizar cada descarga
    descargas.forEach(descarga => {
        const item = crearItemDescarga(descarga);
        downloadsList.appendChild(item);
    });
}

// Crear elemento de descarga
function crearItemDescarga(descarga) {
    const div = document.createElement('div');
    div.className = 'download-item';

    const statusClass = `status-${descarga.estado}`;
    const progressClass = `progress-${descarga.estado}`;

    div.innerHTML = `
        <div class="download-content">
            <div class="download-info">
                <div class="download-header">
                    <div class="status-icon ${statusClass}">
                        ${getEstadoIcon(descarga.estado)}
                    </div>
                    <div class="download-title-section">
                        <h3 class="download-title">${descarga.nombre}</h3>
                        <p class="download-size">${descarga.tamaño}</p>
                    </div>
                    <span class="status-badge ${statusClass}">
                        ${descarga.estado.charAt(0).toUpperCase() + descarga.estado.slice(1)}
                    </span>
                </div>

                <div class="progress-section">
                    <div class="progress-header">
                        <span>Progreso</span>
                        <span class="font-medium">${descarga.progreso}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${progressClass}" style="width: ${descarga.progreso}%"></div>
                    </div>
                </div>

                <div class="download-meta">
                    <div class="meta-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="label">Assigned to:</span>
                        <span>${descarga.asignadoA}</span>
                    </div>
                    <div class="meta-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="label">Fecha:</span>
                        <span>${formatearFecha(descarga.fechaCreacion)}</span>
                    </div>
                </div>
            </div>

            <div class="download-actions">
                ${getActionButtons(descarga)}
            </div>
        </div>
    `;

    // Agregar event listeners a los botones
    agregarEventListeners(div, descarga);

    return div;
}

// Obtener icono según estado
function getEstadoIcon(estado) {
    switch (estado) {
        case 'completada':
            return `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`;
        case 'descargando':
            return `<svg class="animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>`;
        case 'pausada':
            return `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`;
    }
}

// Obtener botones de acción según estado
function getActionButtons(descarga) {
    let buttons = '';

    if (descarga.estado === 'descargando') {
        buttons += `
            <button class="action-btn action-btn-yellow" data-action="pausar" data-id="${descarga.id}" title="Pausar">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </button>
        `;
    }

    if (descarga.estado === 'pausada') {
        buttons += `
            <button class="action-btn action-btn-blue" data-action="reanudar" data-id="${descarga.id}" title="Reanudar">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </button>
        `;
    }

    if (descarga.estado === 'pausada' || descarga.estado === 'descargando') {
        buttons += `
            <button class="action-btn action-btn-green" data-action="completar" data-id="${descarga.id}" title="Marcar como completada">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </button>
        `;
    }

    buttons += `
        <button class="action-btn action-btn-indigo" data-action="editar" data-id="${descarga.id}" title="Editar">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
        </button>
        <button class="action-btn action-btn-red" data-action="eliminar" data-id="${descarga.id}" title="Eliminar">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
        </button>
    `;

    return buttons;
}

// Agregar event listeners a botones de acción
function agregarEventListeners(element, descarga) {
    const buttons = element.querySelectorAll('[data-action]');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            const id = button.dataset.id;

            switch (action) {
                case 'pausar':
                    cambiarEstado(id, 'pausada');
                    break;
                case 'reanudar':
                    cambiarEstado(id, 'descargando');
                    break;
                case 'completar':
                    cambiarEstado(id, 'completada');
                    break;
                case 'editar':
                    iniciarEdicion(id);
                    break;
                case 'eliminar':
                    eliminarDescarga(id);
                    break;
            }
        });
    });
}

// Formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}