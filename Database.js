//Database.js
//Este es mi archivo principal de backend
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const { connection, cerrarConexion,SECRET_KEY } = require('./endpoints/conecction');
const loginRouter = require("./endpoints/usuarios/login")
const registroRouter=require('./endpoints/usuarios/registro')
const directorioUploads = path.join(__dirname, 'uploads');
const listarArchivosRouter = require("./endpoints/archivos/listar")(directorioUploads);
const exportUsers=require("./endpoints/usuarios/exportar");
const deleteUser = require("./endpoints/archivos/eliminar")(directorioUploads);
const editarNombreArchivoRouter = require("./endpoints/archivos/editarNombre")(directorioUploads);
const subirArchivoRouter=require("./endpoints/archivos/subir")

app.use('/archivos', express.static(directorioUploads));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'CafeStarbucks')));
app.use("/", loginRouter)
app.use("/registrar",registroRouter)
app.use("/",listarArchivosRouter)
app.use("/",exportUsers)
app.use("/",deleteUser)
app.use("/", editarNombreArchivoRouter);
app.use("/",subirArchivoRouter)

app.get('/get-secret-key', (req, res) => {
  res.json({ SECRET_KEY });
});
// Configurar el endpoint para servir archivos CSS y JavaScript dinámicamente
app.get('/archivos.css/:nombreArchivo', (req, res) => {
  const nombreArchivo = req.params.nombreArchivo;
  res.sendFile(path.join(__dirname, 'archivos.css', nombreArchivo));
});
app.get('/archivos.js/:nombreArchivo', (req, res) => {
  const nombreArchivo = req.params.nombreArchivo;
  res.sendFile(path.join(__dirname, 'archivos.js', nombreArchivo));
});
// Configurar el endpoint para servir las imágenes estáticas
app.get('/imagenes/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, 'imagenes', imageName));
});

// Configurar el endpoint para servir imágenes estáticas desde el directorio 'imagenes/img'
app.get('/imagenes/img/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, 'imagenes', 'img', imageName));
});
// Configurar el endpoint para servir imágenes estáticas desde el directorio 'imagenes/tiendas'
app.get('/imagenes/tiendas/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, 'imagenes', 'tiendas', imageName));
});
app.get('/Manuales.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Manuales.html'));
});

app.get('/visualizacion.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'visualizacion.html'));
});

app.get('/sedes.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'sedes.html'));
});

// Configurar el endpoint para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admnistador.html'));
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta para acceder a los archivos en la carpeta "uploads"
app.get('/archivos/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  res.sendFile(path.join(__dirname, 'uploads', fileName));
});
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

app.get('/archivos', (req, res) => {
  // Obtener la lista de archivos en la carpeta "uploads"
  fs.readdir(directorioUploads, (err, archivos) => {
    if (err) {
      console.error('Error al leer la carpeta de archivos:', err);
      return res.status(500).send('Error interno del servidor');
    }
    res.json({ archivos });
    console.log('Archivos en la carpeta uploads:', archivos);
  });
});
process.on('SIGINT', () => {
  cerrarConexion();
  process.exit();
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

