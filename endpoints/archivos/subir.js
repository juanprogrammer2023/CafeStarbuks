// subir.js
const express = require("express");
const multer = require("multer");
const router = express.Router();

// Configurar Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype !== 'application/pdf') {
    req.fileValidationError = 'El archivo debe ser un PDF';
    return cb(null, false, new Error('El archivo debe ser un PDF'));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Definir la ruta para la subida de archivos
router.post('/subir-archivo', upload.single('archivo'), (req, res) => {
  // Verificar si hay errores de validación de archivos
  if (req.fileValidationError) {
    return res.status(400).send(req.fileValidationError);
  }
  // Si no se proporcionó un archivo, enviar un error
  if (!req.file) {
    return res.status(400).send('No se proporcionó ningún archivo');
  }
  // Si se llega a este punto, significa que el archivo es un PDF y se ha subido correctamente
  res.status(200).json({ mensaje: 'El archivo fue subido exitosamente', nombreArchivo: req.file.filename });
});

module.exports = router;
