// Función para obtener la lista de archivos disponibles
function obtenerArchivos() {
  fetch('http://18.188.216.108:3000/archivos')
    .then(response => response.json())
    .then(data => {
      const listaArchivos = document.getElementById('lista-archivos');
      listaArchivos.innerHTML = ''; // Limpiar la lista antes de mostrar los archivos

      // Filtrar archivos ocultos como .DS_Store antes de mostrarlos
      const archivosVisibles = data.archivos.filter(nombreArchivo => !nombreArchivo.startsWith('.'));
      
      archivosVisibles.forEach(nombreArchivo => {
        // Crear un nuevo div para cada archivo
        const nuevoArchivo = document.createElement('div');
        nuevoArchivo.classList.add('archivo');

        // Contenido del nuevo div
        nuevoArchivo.innerHTML = `
  <img src="imagenes/carpetas.png" alt="Archivo" width="50">
  <p>${nombreArchivo}</p>
  <a href="http://18.188.216.108:3000/${nombreArchivo}" target="_blank">
    <button>Descargar</button>
  </a>
`;


        // Agregar el nuevo div al div de lista de archivos
        listaArchivos.appendChild(nuevoArchivo);
      });
    })
    .catch(error => console.error('Error al obtener la lista de archivos:', error));
}


// Llamar a la función para obtener la lista de archivos cuando la página se cargue
document.addEventListener('DOMContentLoaded', obtenerArchivos);

function exportarUsuarios() {
  // Hacer una solicitud GET al endpoint /exportar-usuarios
  fetch('http://18.188.216.108:3000/exportar-usuarios')
      .then(response => {
          // Verificar si la respuesta es exitosa
          if (!response.ok) {
              throw new Error('Error al exportar usuarios');
          }
          // Descargar el archivo Excel
          return response.blob();
      })
      .then(blob => {
          // Crear un objeto URL a partir del blob
          const url = window.URL.createObjectURL(blob);
          // Crear un enlace <a> para descargar el archivo
          const a = document.createElement('a');
          a.href = url;
          a.download = 'usuarios.xlsx'; // Nombre del archivo a descargar
          // Simular un clic en el enlace para iniciar la descarga
          a.click();
          // Limpiar el objeto URL después de la descarga
          window.URL.revokeObjectURL(url);
      })
      .catch(error => {
          console.error('Error al exportar usuarios:', error);
          alert('Error al exportar usuarios. Por favor, inténtalo de nuevo.');
      });
}