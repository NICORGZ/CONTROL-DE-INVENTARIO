// Función para registrar la entrada
function registrarEntrada() {
    const proceso = document.getElementById('proceso').value;
    const cantidades = document.getElementById('cantidades').value;
    const cliente = document.getElementById('cliente').value;
    const fechaLlegada = document.getElementById('fecha-llegada').value;
    
    if (proceso && cantidades && cliente && fechaLlegada) {
        const registro = {
            proceso,
            cantidades,
            cliente,
            fechaLlegada,
            fechaSalida: null,
            fechaRegistro: new Date().toISOString(),
        };

        // Guardar en localStorage (base de datos)
        let registros = JSON.parse(localStorage.getItem('registros')) || [];
        registros.push(registro);
        localStorage.setItem('registros', JSON.stringify(registros));

        // Mostrar mensaje de éxito
        document.getElementById('mensaje-exito').classList.remove('hidden');

        // Limpiar campos
        document.getElementById('proceso').value = '';
        document.getElementById('cantidades').value = '';
        document.getElementById('cliente').value = '';
        document.getElementById('fecha-llegada').value = '';

        // Redirigir a la página de registros después de un breve tiempo
        setTimeout(() => {
            window.location.href = "DATA/data.html"; // Redirige a la página de registros
        }, 2000);
    }
}

// Función para registrar la salida
function registrarSalida() {
    const procesoSalida = document.getElementById('proceso-salida').value;
    const fechaSalida = document.getElementById('fecha-salida').value;

    if (procesoSalida && fechaSalida) {
        // Obtener los registros de localStorage
        let registros = JSON.parse(localStorage.getItem('registros')) || [];
        
        // Buscar el registro con el proceso correspondiente
        let registro = registros.find(r => r.proceso === procesoSalida);

        if (registro) {
            // Calcular la diferencia en días entre la fecha de llegada y la fecha de salida
            const fechaLlegada = new Date(registro.fechaLlegada);
            const fechaSalidaDate = new Date(fechaSalida);
            const diferenciaDias = Math.floor((fechaSalidaDate - fechaLlegada) / (1000 * 60 * 60 * 24)); // Diferencia en días

            // Si el retraso es de 1 día
            if (diferenciaDias === 1) {
                alert("El proceso lleva 1 día sin actualización. ¡Por favor registre la salida cuanto antes!");
            }
            // Si el retraso es de 2 días
            else if (diferenciaDias === 2) {
                alert("¡El proceso es urgente! Llevas 2 días sin registrar la salida.");
            }
            // Si el retraso es mayor de 2 días
            else if (diferenciaDias > 2) {
                const novedad = confirm("El proceso lleva más de 2 días sin actualización. ¿Hay alguna novedad en el proceso?");
                if (novedad) {
                    // Permitir registrar una novedad
                    const novedadTexto = prompt("Por favor ingrese la novedad relacionada con este proceso:");
                    if (novedadTexto) {
                        // Guardar la novedad en el registro
                        if (!registro.novedades) {
                            registro.novedades = [];
                        }
                        registro.novedades.push(novedadTexto);
                        // Actualizar el registro con la novedad
                        localStorage.setItem('registros', JSON.stringify(registros));
                        alert("Novedad registrada correctamente.");
                    }
                }
            }

            // Actualizar la fecha de salida
            registro.fechaSalida = fechaSalida;
            // Guardar nuevamente los registros con la fecha de salida actualizada
            localStorage.setItem('registros', JSON.stringify(registros));

            // Mostrar mensaje de éxito
            alert("Salida registrada exitosamente.");

            // Limpiar el formulario de salida
            document.getElementById('proceso-salida').value = '';
            document.getElementById('fecha-salida').value = '';
        } else {
            alert("El proceso no existe. Verifique el número de proceso.");
        }
    } else {
        alert("Debe completar todos los campos.");
    }
}

// Función para eliminar un registro
function eliminarRegistro(proceso) {
    // Obtener los registros de localStorage
    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    
    // Filtrar el registro a eliminar
    registros = registros.filter(r => r.proceso !== proceso);

    // Guardar los registros actualizados
    localStorage.setItem('registros', JSON.stringify(registros));

    // Actualizar la tabla después de eliminar
    actualizarTabla();
}

// Función para actualizar la tabla de registros
function actualizarTabla() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const tabla = document.getElementById('registro-tabla').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';  // Limpiar la tabla antes de volver a llenarla
    
    // Si no hay registros, mostrar un mensaje en la tabla
    if (registros.length === 0) {
        const row = tabla.insertRow();
        row.innerHTML = '<td colspan="7">No hay registros disponibles.</td>';
    }

    registros.forEach(registro => {
        const row = tabla.insertRow();
        row.innerHTML = `
            <td>${registro.proceso}</td>
            <td>${registro.cantidades}</td>
            <td>${registro.cliente}</td>
            <td>${registro.fechaLlegada}</td>
            <td>${registro.fechaSalida || 'Pendiente'}</td>
            <td>${registro.novedades ? registro.novedades.join(', ') : 'Sin novedades'}</td>
            <td><button onclick="eliminarRegistro('${registro.proceso}')">Eliminar</button></td>
        `;

        // Verificar si hay retraso en el proceso (sin salida registrada)
        if (!registro.fechaSalida) {
            const fechaLlegada = new Date(registro.fechaLlegada);
            const hoy = new Date();
            const diferenciaDias = Math.floor((hoy - fechaLlegada) / (1000 * 60 * 60 * 24)); // Diferencia en días

            // Si el retraso es de 1 día
            if (diferenciaDias === 1) {
                alert(`El proceso #${registro.proceso} lleva 1 día sin actualización. ¡Por favor registre la salida cuanto antes!`);
            }
            // Si el retraso es de 2 días
            else if (diferenciaDias === 2) {
                alert(`¡El proceso #${registro.proceso} es urgente! Llevas 2 días sin registrar la salida.`);
            }
            // Si el retraso es mayor de 2 días
            else if (diferenciaDias > 2) {
                const novedad = confirm(`El proceso #${registro.proceso} lleva más de 2 días sin actualización. ¿Hay alguna novedad en el proceso?`);
                if (novedad) {
                    // Permitir registrar una novedad
                    const novedadTexto = prompt(`Por favor ingrese la novedad relacionada con el proceso #${registro.proceso}:`);
                    if (novedadTexto) {
                        // Guardar la novedad en el registro
                        if (!registro.novedades) {
                            registro.novedades = [];
                        }
                        registro.novedades.push(novedadTexto);
                        // Actualizar el registro con la novedad
                        localStorage.setItem('registros', JSON.stringify(registros));
                        alert("Novedad registrada correctamente.");
                    }
                }
            }
        }
    });
}

// Llamar la función para cargar los registros cuando la página de `data.html` se carga
window.onload = function() {
    actualizarTabla();
};
