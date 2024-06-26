//manuales.js//client
const areas=document.getElementById('areas')
const btonEliminar=document.getElementById('btonEliminar')
const formulario=document.getElementById('miFormulario')
const btoninfoarchivos=document.getElementById('infoarchivos')
const infoarchivos=document.getElementById('resultado')
const btonEditar=document.getElementById('edicion')
const formEditor=document.getElementById('formEditor')
const btonTerminarEdicion=document.getElementById('btonTerminarEdicion')
let SECRET_KEY;

function obtenerSecretKey() {
    fetch('http://18.188.216.108:3000/get-secret-key')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            SECRET_KEY = parseFloat(data.SECRET_KEY);
            console.log("SECRET_KEY obtenida:", float);
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar errores
        });
}

// Llamar a la función para obtener la SECRET_KEY cuando se cargue la página
document.addEventListener('DOMContentLoaded', obtenerSecretKey);

function redirigirAPagina() {
  // Cambiar la ubicación de la página al hacer clic en el botón
  window.location.href = './visualizacion.html';
}

btonEliminar.addEventListener('click', function() {
    formulario.classList.remove('oculto');
    formulario.classList.add('visible');
    infoarchivos.classList.remove('visible');
    infoarchivos.classList.add('oculto');
    formEditor.classList.remove('visible');
    formEditor.classList.add('oculto');
});

btoninfoarchivos.addEventListener('click', function() {
    infoarchivos.classList.remove('oculto');
    infoarchivos.classList.add('visible');
    formulario.classList.remove('visible');
    formulario.classList.add('oculto');
    formEditor.classList.remove('visible');
    formEditor.classList.add('oculto');
});

btonEditar.addEventListener('click', function() {
    formEditor.classList.remove('oculto');
    formEditor.classList.add('visible');
    formulario.classList.remove('visible');
    formulario.classList.add('oculto');
    infoarchivos.classList.remove('visible');
    infoarchivos.classList.add('oculto');
});

areas.addEventListener('click',()=>{
  window.location.href='./sedes.html'
})

// Escuchar el evento de clic en el botón "Terminar Edición"
document.getElementById('btonTerminarEdicion').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    let nombreActual = document.querySelector('.nombre').value;
    let nuevoNombre = document.querySelector('.nuevoNombre').value;
    let contrasena = ""; // Inicializar la variable contrasena
    const contenedorItems = document.querySelectorAll("#formEditor .box input");
    
    contenedorItems.forEach(el => {
      contrasena += el.value; 
    });
  
    
    if (Number(contrasena) === SECRET_KEY) {
    
      let data = {
        nombreActual: nombreActual,
        nuevoNombre: nuevoNombre
      };
  
      // Realizar la solicitud PUT al servidor
      fetch('http://18.188.216.108:3000/editar-nombre-archivo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Ocurrió un error al renombrar el archivo');
        }
        return response.json();
      })
      .then(function(data) {
        // Manejar la respuesta del servidor
        console.log(data);
        alert('El archivo se ha renombrado exitosamente');
      })
      .catch(function(error) {
        // Manejar errores de la solicitud
        console.error(error);
        alert(error.message +' :la extension debe ser PDF' );
      }); 
    } else {
      // La contraseña no es correcta
      alert('La contraseña no es correcta');
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form'); // Asegúrate de que realmente tienes un elemento con la clase .form en tu HTML
    const inputNombreArchivo = document.querySelector('.objElim');
    const botonEliminar = document.getElementById('btonTerminarEliminacion');
    const contenedorItems = document.querySelectorAll(".box .input");// Asegúrate de que el espacio antes de .input es un error de tipografía.

    botonEliminar.addEventListener('click', function(event) {
        event.preventDefault(); // Previene el comportamiento de envío estándar del formulario.
        let contrasena = '';
        contenedorItems.forEach(el => {
            contrasena += el.value; // Concatena el valor de cada input a la contraseña.
        });

        const nombreArchivo = inputNombreArchivo.value.trim();

        if (nombreArchivo && Number(contrasena) === SECRET_KEY) { 
            fetch('http://18.188.216.108:3000/eliminar-archivo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombreArchivo }) // Envía el nombre del archivo como JSON.
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                alert(data); // Mostrar respuesta del servidor.
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el archivo');
            });
        } else {
            alert('Por favor, ingrese el nombre del archivo a eliminar y asegúrese de que la contraseña es correcta.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const botonInfoArchivos = document.getElementById('infoarchivos');
    const resultadoDiv = document.getElementById('resultado');

    botonInfoArchivos.addEventListener('click', function() {
        fetch('http://18.188.216.108:3000/listar-archivos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Puedes remover esta línea después de las pruebas
                mostrarResultados(data);
            })
            .catch(error => {
                console.error('Error:', error);
                resultadoDiv.innerHTML = `<p>Error al cargar la información: ${error.message}</p>`;
            });
    });

    function mostrarResultados(data) {
        if (data.total > 0) {
            const archivos = data.archivos.map(archivo =>
                `<li>${archivo.nombre} (Tamaño: ${archivo.tamaño} bytes, Creado: ${archivo.creado}, Modificado: ${archivo.modificado})</li>`
            ).join('');
            resultadoDiv.innerHTML = `<ul>${archivos}</ul>`;
        } else {
            resultadoDiv.innerHTML = '<p>No hay archivos para mostrar.</p>';
        }
    }
});

function lanzarConfetis() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  // Obtener el nombre del usuario de la URL
  const urlParams = new URLSearchParams(window.location.search);
  let nombre = urlParams.get('nombre');
  if (!nombre) {
    nombre = 'Invitado nuevo';
  }

  // Mostrar el div con el mensaje de bienvenida
  const mensajeBienvenida = document.getElementById('mensajeBienvenida');
  const texto = document.getElementById('texto');
  texto.innerText = "¡Hola, " + nombre.split(' ')[0] + "! Es un gusto tenerte de nuevo aquí";
  mensajeBienvenida.classList.add('mensaje-visible') // Agregar clase para mostrar el mensaje
  lanzarConfetis();

  setTimeout(() => {
    mensajeBienvenida.classList.remove("mensaje-visible");
  }, 3000); 

  // Almacenar el nombre en el localStorage
  localStorage.setItem('nombreUsuario', nombre);
});



