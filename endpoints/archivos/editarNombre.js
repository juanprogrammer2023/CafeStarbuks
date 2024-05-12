const express = require("express");
const router = express.Router();
const path = require("path");   
const fs = require("fs");   

module.exports = function(directorioUploads) {
  router.put('/editar-nombre-archivo', (req, res) => {
    const { nombreActual, nuevoNombre } = req.body;
  
    // Verificar si se proporcionaron ambos nombres
    if (!nombreActual || !nuevoNombre) {
      return res.status(400).send('Debe proporcionar el nombre actual y el nuevo nombre');
    }

    const rutaArchivoActual = path.join(directorioUploads, nombreActual);
    const rutaNuevoArchivo = path.join(directorioUploads, nuevoNombre);
  
    // Verificar si el archivo con el nombre actual existe
    fs.access(rutaArchivoActual, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('El archivo no existe:', err);
        return res.status(404).send('El archivo no existe');
      }
  
      // Verificar si el nuevo nombre termina con .pdf
      if (!nuevoNombre.endsWith('.pdf')) {
        return res.status(400).send('El nuevo nombre debe tener la extensión .pdf');
      }
  
      // Actualizar el nombre del archivo en el sistema de archivos
      fs.rename(rutaArchivoActual, rutaNuevoArchivo, (err) => {
        if (err) {
          console.error('Error al renombrar el archivo:', err);
          return res.status(500).send('Error al renombrar el archivo');
        }
  
        console.log('Archivo renombrado exitosamente');
        res.status(200).json({ mensaje: 'Archivo renombrado exitosamente' });
      });
    });
  });

  return router;
};
