// Calculadora de Láminas de Acero - Acero JJ
// Este script maneja la funcionalidad de la calculadora de láminas

// Variables globales para almacenar el último cálculo
let ultimoCalculo = null;

// Constantes
const DENSIDAD_ACERO = 7850; // kg/m³

// Elementos del DOM
const form = document.getElementById('laminaForm');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnGuardar = document.getElementById('btnGuardar');
const btnGuardarContainer = document.getElementById('btnGuardarContainer');
const btnLimpiarTodo = document.getElementById('btnLimpiarTodo');
const resultadosDiv = document.getElementById('resultados');
const cotizacionesDiv = document.getElementById('cotizacionesGuardadas');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    cargarCotizaciones();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularLamina();
    });

    btnLimpiar.addEventListener('click', function() {
        limpiarFormulario();
    });

    btnGuardar.addEventListener('click', function() {
        guardarCotizacion();
    });

    btnLimpiarTodo.addEventListener('click', function() {
        if (confirm('¿Está seguro de que desea eliminar todas las cotizaciones guardadas?')) {
            localStorage.removeItem('cotizaciones');
            cargarCotizaciones();
        }
    });
});

// Función principal de cálculo
function calcularLamina() {
    // Obtener valores del formulario
    const tipoSelect = document.getElementById('tipoLamina');
    const tipoLamina = tipoSelect.value;
    const nombreTipo = tipoSelect.options[tipoSelect.selectedIndex].text;
    const precioPorKg = parseFloat(tipoSelect.options[tipoSelect.selectedIndex].dataset.precio);
    
    const espesor = parseFloat(document.getElementById('espesor').value) / 1000; // Convertir mm a metros
    const largo = parseFloat(document.getElementById('largo').value);
    const ancho = parseFloat(document.getElementById('ancho').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);

    // Validaciones
    if (!tipoLamina || !espesor || !largo || !ancho || !cantidad) {
        mostrarError('Por favor, complete todos los campos.');
        return;
    }

    // Cálculos
    const areaUnitaria = largo * ancho; // m²
    const areaTotal = areaUnitaria * cantidad; // m²
    
    const volumenUnitario = largo * ancho * espesor; // m³
    const volumenTotal = volumenUnitario * cantidad; // m³
    
    const pesoUnitario = volumenUnitario * DENSIDAD_ACERO; // kg
    const pesoTotal = volumenTotal * DENSIDAD_ACERO; // kg
    
    const precioUnitario = pesoUnitario * precioPorKg; // pesos
    const precioTotal = pesoTotal * precioPorKg; // pesos

    // Guardar el cálculo actual
    ultimoCalculo = {
        tipo: nombreTipo,
        espesor: parseFloat(document.getElementById('espesor').value),
        largo: largo,
        ancho: ancho,
        cantidad: cantidad,
        areaUnitaria: areaUnitaria,
        areaTotal: areaTotal,
        pesoUnitario: pesoUnitario,
        pesoTotal: pesoTotal,
        precioUnitario: precioUnitario,
        precioTotal: precioTotal,
        fecha: new Date().toISOString()
    };

    // Mostrar resultados
    mostrarResultados(ultimoCalculo);
    btnGuardarContainer.style.display = 'block';
}

// Función para mostrar resultados
function mostrarResultados(calculo) {
    const html = `
        <div class="resultado-item">
            <h6 class="text-primary">Por Lámina:</h6>
            <p class="mb-1"><strong>Área:</strong> ${calculo.areaUnitaria.toFixed(2)} m²</p>
            <p class="mb-1"><strong>Peso:</strong> ${calculo.pesoUnitario.toFixed(2)} kg</p>
            <p class="mb-3"><strong>Precio:</strong> $${calculo.precioUnitario.toFixed(2)}</p>
            
            <hr>
            
            <h6 class="text-success">Total (${calculo.cantidad} láminas):</h6>
            <p class="mb-1"><strong>Área Total:</strong> ${calculo.areaTotal.toFixed(2)} m²</p>
            <p class="mb-1"><strong>Peso Total:</strong> ${calculo.pesoTotal.toFixed(2)} kg</p>
            <p class="mb-0 fs-5"><strong>Precio Total:</strong> <span class="text-success">$${calculo.precioTotal.toFixed(2)}</span></p>
        </div>
    `;
    
    resultadosDiv.innerHTML = html;
}

// Función para mostrar errores
function mostrarError(mensaje) {
    resultadosDiv.innerHTML = `
        <div class="alert alert-danger">
            <strong>Error:</strong> ${mensaje}
        </div>
    `;
    btnGuardarContainer.style.display = 'none';
}

// Función para limpiar el formulario
function limpiarFormulario() {
    resultadosDiv.innerHTML = `
        <div class="alert alert-info">
            <small>Complete el formulario y presione "Calcular" para ver los resultados.</small>
        </div>
    `;
    btnGuardarContainer.style.display = 'none';
    ultimoCalculo = null;
}

// Función para guardar cotización
function guardarCotizacion() {
    if (!ultimoCalculo) {
        alert('No hay cálculo para guardar.');
        return;
    }

    // Obtener cotizaciones existentes
    let cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    
    // Agregar nueva cotización
    cotizaciones.push({
        ...ultimoCalculo,
        id: Date.now()
    });
    
    // Guardar en localStorage
    localStorage.setItem('cotizaciones', JSON.stringify(cotizaciones));
    
    // Actualizar visualización
    cargarCotizaciones();
    
    // Mostrar mensaje de éxito
    alert('Cotización guardada exitosamente.');
}

// Función para cargar y mostrar cotizaciones guardadas
function cargarCotizaciones() {
    const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    
    if (cotizaciones.length === 0) {
        cotizacionesDiv.innerHTML = '<p class="text-muted">No hay cotizaciones guardadas.</p>';
        return;
    }

    let html = '<div class="table-responsive"><table class="table table-hover"><thead class="table-light"><tr><th>Fecha</th><th>Tipo</th><th>Dimensiones</th><th>Cantidad</th><th>Peso Total</th><th>Precio Total</th><th>Acciones</th></tr></thead><tbody>';
    
    cotizaciones.reverse().forEach(cot => {
        const fecha = new Date(cot.fecha);
        const fechaStr = fecha.toLocaleDateString('es-MX', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <tr>
                <td>${fechaStr}</td>
                <td>${cot.tipo}</td>
                <td>${cot.largo}m × ${cot.ancho}m × ${cot.espesor}mm</td>
                <td>${cot.cantidad}</td>
                <td>${cot.pesoTotal.toFixed(2)} kg</td>
                <td class="text-success fw-bold">$${cot.precioTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetalle(${cot.id})">Ver</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarCotizacion(${cot.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    cotizacionesDiv.innerHTML = html;
}

// Función para ver detalle de una cotización
function verDetalle(id) {
    const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacion = cotizaciones.find(c => c.id === id);
    
    if (!cotizacion) {
        alert('Cotización no encontrada.');
        return;
    }

    const detalleHtml = `
        <strong>Tipo:</strong> ${cotizacion.tipo}<br>
        <strong>Espesor:</strong> ${cotizacion.espesor} mm<br>
        <strong>Dimensiones:</strong> ${cotizacion.largo}m × ${cotizacion.ancho}m<br>
        <strong>Cantidad:</strong> ${cotizacion.cantidad} láminas<br>
        <hr>
        <strong>Área unitaria:</strong> ${cotizacion.areaUnitaria.toFixed(2)} m²<br>
        <strong>Área total:</strong> ${cotizacion.areaTotal.toFixed(2)} m²<br>
        <strong>Peso unitario:</strong> ${cotizacion.pesoUnitario.toFixed(2)} kg<br>
        <strong>Peso total:</strong> ${cotizacion.pesoTotal.toFixed(2)} kg<br>
        <strong>Precio unitario:</strong> $${cotizacion.precioUnitario.toFixed(2)}<br>
        <strong>Precio total:</strong> $${cotizacion.precioTotal.toFixed(2)}
    `;
    
    // Crear y mostrar modal con Bootstrap
    const modalHtml = `
        <div class="modal fade" id="detalleModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalle de Cotización</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${detalleHtml}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const oldModal = document.getElementById('detalleModal');
    if (oldModal) {
        oldModal.remove();
    }
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('detalleModal'));
    modal.show();
    
    // Limpiar modal cuando se cierre
    document.getElementById('detalleModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Función para eliminar una cotización
function eliminarCotizacion(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta cotización?')) {
        return;
    }
    
    let cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    cotizaciones = cotizaciones.filter(c => c.id !== id);
    localStorage.setItem('cotizaciones', JSON.stringify(cotizaciones));
    cargarCotizaciones();
}
