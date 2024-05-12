//EliminarArchivo.js
const express = require("express");
const router = express.Router();
const path = require("path");   
const fs = require("fs");   

module.exports = function(directorioUploads) {
  router.post('/eliminar-archivo', (req, res) => {
      const { nombreArchivo } = req.body;
    
      const rutaArchivo = path.join(directorioUploads, nombreArchivo);
      fs.unlink(rutaArchivo, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error al eliminar el archivo');
        }
        res.send('Archivo eliminado exitosamente');
      });
    });

  return router;
};
