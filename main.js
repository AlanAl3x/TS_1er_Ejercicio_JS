// Capturamos el formulario
const citasCapturadasJS = document.getElementById('infoDeCitas');

// Capturamos la sección donde se mostrarán las citas
const listaCitas = document.getElementById('lista-citas');

// Capturar el botón "Agendar" para cambiar su texto cuando estemos en modo edición
const botonAgendar = citasCapturadasJS.querySelector('button[type="submit"]');

// Crear un arreglo para almacenar las citas (inicialmente vacío o cargado desde localStorage)
let arregloDeCitas = JSON.parse(localStorage.getItem('citasGuardadas')) || [];
let citaEnEdicionIndex = null; // Guardamos el índice de la cita en edición


// Función para mostrar las citas en la página
function mostrarCitas() {
    // Limpiar el contenido actual
    listaCitas.innerHTML = '';

    // Ordenar las citas cronológicamente
    arregloDeCitas.sort((fechaA, fechaB) => {
        const fechaHoraA = new Date(`${fechaA.fecha}T${fechaA.hora}`);
        const fechaHoraB = new Date(`${fechaB.fecha}T${fechaB.hora}`);
        return fechaHoraA - fechaHoraB;
        // Ordenar de la mas reciente a la mas antigua gracias a la funcion sort
    });

    // Si no hay citas, mostrar un mensaje
    if (arregloDeCitas.length === 0) {
        listaCitas.innerHTML = '<p>No hay citas programadas.</p>';
    } else {
        // Crear una lista de citas
        arregloDeCitas.forEach(function(cita, index) {
            const citaElemento = document.createElement('p');
            citaElemento.textContent = `Nombre: ${cita.nombre}, Fecha: ${cita.fecha}, Hora: ${cita.hora}, Precio: ${cita.precio}`;

            // Crear el botón de editar
            const botonEditar = document.createElement('button');
            botonEditar.textContent = 'Editar';
            botonEditar.style.marginLeft = '10px';

            // Escuchar el evento clic en el botón de editar
            botonEditar.addEventListener('click', function() {
                editarCita(index);
            });

            // Crear el botón de eliminar
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.style.marginLeft = '10px';

            // Escuchar el evento clic en el botón de eliminar
            botonEliminar.addEventListener('click', function() {
                if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
                    eliminarCita(index);
                }
            });

            // Añadir los botones al elemento de la cita
            citaElemento.appendChild(botonEditar);
            citaElemento.appendChild(botonEliminar);

            // Añadir la cita al contenedor
            listaCitas.appendChild(citaElemento);
        });
    }
}


// Función para editar una cita
function editarCita(index) {
    const cita = arregloDeCitas[index];

    // Rellenar el formulario con los datos de la cita seleccionada
    document.getElementById('nombre').value = cita.nombre;
    document.getElementById('fecha').value = cita.fecha;
    document.getElementById('hora').value = cita.hora;
    document.getElementById('precio').value = cita.precio;

    // Cambiar el texto del botón a "Guardar cambios"
    botonAgendar.textContent = 'Guardar cambios';

    // Guardar el índice de la cita que estamos editando
    citaEnEdicionIndex = index;

    // Marcar el formulario como en modo de edición
    citasCapturadasJS.setAttribute('data-editing', 'true');
}

// Función para eliminar una cita
function eliminarCita(index) {
    // Mostrar un mensaje de confirmación antes de eliminar
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
        // Eliminar la cita del arreglo usando su índice
        arregloDeCitas.splice(index, 1);

        // Actualizar el localStorage con el nuevo arreglo
        localStorage.setItem('citasGuardadas', JSON.stringify(arregloDeCitas));

        // Mostrar el arreglo actualizado en la consola
        console.log("Citas actualizadas después de eliminar:", arregloDeCitas);
        
        // Mostrar las citas actualizadas en la página
        mostrarCitas();
    }
}

// Mostrar el arreglo de citas en la consola al cargar la página
console.log("Citas cargadas desde localStorage:", arregloDeCitas);

// Mostrar las citas en la página al cargar
mostrarCitas();

// Escuchar el evento de envío del formulario
citasCapturadasJS.addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir que la página se recargue

    // Obtener los valores de los campos de entrada
    const nombre = document.getElementById('nombre').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const precio = document.getElementById('precio').value;

    // Si estamos en modo edición, actualizar la cita existente
    if (citasCapturadasJS.hasAttribute('data-editing')) {
        arregloDeCitas[citaEnEdicionIndex] = {
            nombre: nombre,
            fecha: fecha,
            hora: hora,
            precio: precio
        };

        // Cambiar el texto del botón a "Agendar" de nuevo
        botonAgendar.textContent = 'Agendar';

        // Quitar el estado de edición
        citasCapturadasJS.removeAttribute('data-editing');
        citaEnEdicionIndex = null;

    } else {
        // Crear un objeto con los datos de la cita
        const nuevaCita = {
            nombre: nombre,
            fecha: fecha,
            hora: hora,
            precio: precio
        };

        // Agregar la nueva cita al arreglo de citas
        arregloDeCitas.push(nuevaCita);
    }

    // Guardar las citas actualizadas en localStorage con la clave 'citasGuardadas'
    localStorage.setItem('citasGuardadas', JSON.stringify(arregloDeCitas));

    // Mostrar el arreglo actualizado en la consola
    console.log("Citas actualizadas:", arregloDeCitas);

    // Mostrar las citas actualizadas en la página
    mostrarCitas();

    // Limpiar el formulario después de agregar/editar una cita
    citasCapturadasJS.reset();
});


//antes de google