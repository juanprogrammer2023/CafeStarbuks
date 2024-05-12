//listar.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

module.exports = function(directorioUploads) {
  router.get('/listar-archivos', (req, res) => {
    fs.readdir(directorioUploads, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error('Error al leer el directorio:', err);
        return res.status(500).json({ error: 'Error al leer el directorio' });
      }
      // Filtra para asegurarse de que sólo se listan los archivos (no directorios)
      const fileList = files.filter(file => file.isFile()).map(file => {
        try {
          const filePath = path.join(directorioUploads, file.name);
          const fileInfo = fs.statSync(filePath);
  
          return {
            nombre: file.name,
            tamaño: fileInfo.size,
            creado: fileInfo.birthtime,
            modificado: fileInfo.mtime
          };
        } catch (error) {
          console.error('Error al obtener información del archivo:', error);
          return { error: 'Error al obtener información del archivo', nombre: file.name };
        }
      });
  
      res.json({
        total: fileList.length,
        archivos: fileList.filter(file => !file.error) // Filtra fuera cualquier archivo que tuvo errores
      });
    });
  });

  return router;
};


