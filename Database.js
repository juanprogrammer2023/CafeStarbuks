//Database.js
//Este es mi archivo principal de backend
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // Importamos el módulo path
const multer = require('multer');
const fs = require('fs');
const ExcelJS = require('exceljs');
const mime = require('mime-types');
const app = express();


const connection = mysql.createConnection({
  host: 'database-starbucks.c76ow40y46ib.us-east-2.rds.amazonaws.com',
  user: 'JuanJS',
  password: 'QyYDKsD8kavrHw8Pikx5',
  database: 'Starbucks',
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'CafeStarbucks')));


app.post('/login', (req, res) => {
  
  // Obtener el email y la contraseña del cuerpo de la solicitud
  const { email, password } = req.body;
  
  // Consultar la base de datos para verificar las credenciales del usuario
  const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  connection.query(sql, [email, password], (error, results) => {
    if (error) {
    
      console.error('Error al verificar las credenciales del usuario:', error);
      return res.status(500).send('Error interno del servidor');
    }

    // Comprobar si se encontraron resultados en la consulta
    if (results.length > 0) {
      // Si se encontró un usuario con las credenciales proporcionadas, enviar los datos del usuario como respuesta
      const user = results[0];
      res.status(200).json({ name: user.name, email: user.email });
    } else {
      // Si no se encontró ningún usuario con las credenciales proporcionadas, enviar un mensaje de error
      res.status(401).send('Credenciales incorrectas');
    }
  });
});

const ExpReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/~`-]).+$/;
//ENDPOINT PARA REGISTRARSE ACTUALIZACION//
app.post('/registrar', (req, res) => {
  const { name, email, password } = req.body;

  if (password.length > 9 && ExpReg.test(password)) {
    const checkIfExistsQuery = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(checkIfExistsQuery, [email], (error, results) => {
      if (error) {
        // Manejar el error de la consulta
        console.error("Error al verificar si el usuario ya existe:", error);
        res.status(500).send(`
          <html>
            <head><title>Error</title></head>
            <body style="font-family: Arial, sans-serif; margin: 40px; color: red;">
              <h1>Error al registrar el usuario</h1>
              <p>Ha ocurrido un error interno del servidor.</p>
              <button onclick="window.history.back()">Regresar</button>
            </body>
          </html>
        `);
      } else {
        if (results.length > 0) {
          // El usuario ya existe en la base de datos
          res.status(400).send(`
            <html>
              <head><title>Error</title></head>
              <body style="font-family: Arial, sans-serif; margin: 40px; color: red;">
                <h1>Error al registrar el usuario</h1>
                <p>El correo electrónico proporcionado ya está en uso.</p>
                <button onclick="window.history.back()">Regresar</button>
              </body>
            </html>
          `);
        } else {
          // El usuario no existe, realizar la inserción
          const sql = 'INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)';
          connection.query(sql, [name, email, password], (error, results) => {
            if (error) {
              // Manejar el error de la inserción
              console.error("Error al registrar el usuario:", error);
              res.status(500).send(`
                <html>
                  <head><title>Error</title></head>
                  <body style="font-family: Arial, sans-serif; margin: 40px; color: red;">
                    <h1>Error al registrar el usuario</h1>
                    <p>Ha ocurrido un error interno del servidor.</p>
                    <button onclick="window.history.back()">Regresar</button>
                  </body>
                </html>
              `);
            } else {
              // Usuario registrado con éxito
              res.status(200).send(`
                <html>
                  <head><title>Registro Exitoso</title></head>
                  <body style="font-family: Arial, sans-serif; margin: 40px; color: green;">
                    <h1>Usuario registrado con éxito</h1>
                    <p>¡Bienvenido a nuestra comunidad!</p>
                    <button onclick="window.history.back()">Regresar</button>
                  </body>
                </html>
              `);
            }
          });
        }
      }
    });
  } else {
    // La contraseña no cumple con los requisitos de seguridad
    res.status(400).send(`
      <html>
        <head><title>Error de Seguridad</title></head>
        <body style="font-family: Arial, sans-serif; margin: 40px; color: orange;">
          <h1>Contraseña Insegura</h1>
          <p>La contraseña debe tener al menos 10 caracteres y cumplir con los estándares de seguridad.</p>
          <button onclick="window.history.back()">Regresar</button>
        </body>
      </html>
    `);
  }
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
app.get('/exportar-usuarios', (req, res) => {
  const sql = 'SELECT id, name, email, password FROM usuarios';
  
  // Conectar a la base de datos y ejecutar la consulta
  connection.query(sql, async (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      return res.status(500).send('Error interno del servidor');
    }

    try {
      const workbook = new ExcelJS.Workbook();  // Crear un nuevo libro de trabajo
      const worksheet = workbook.addWorksheet('Usuarios');  // Añadir una nueva hoja al libro de trabajo

      // Definir las columnas de la hoja
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nombre', key: 'name', width: 32 },
        { header: 'Email', key: 'email', width: 32 },
        { header: 'Contraseña', key: 'password', width: 32 },
      ];

      // Añadir las filas utilizando los resultados de la consulta
      worksheet.addRows(results);

      // Configurar los headers para informar al navegador que se está enviando un archivo Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');

      // Escribir el archivo Excel al response
      await workbook.xlsx.write(res);

      // Finalizar el response
      res.end();
    } catch (err) {
      console.error('Error al crear el archivo Excel:', err);
      res.status(500).send('Error interno del servidor');
    }
  });
});

const directorioUploads = path.join(__dirname, 'uploads');
app.use('/archivos', express.static(directorioUploads));

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = function (req, file, cb) {
  if (mime.lookup(file.originalname) !== 'application/pdf') {
    req.fileValidationError = 'No es posible ejecutar esta acción porque el archivo no es un PDF';
    return cb(null, false, new Error('No es posible ejecutar esta acción porque el archivo no es un PDF'));
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

app.get('/listar-archivos', (req, res) => {
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

// Endpoint para subir archivos
app.post('/subir-archivo', upload.single('archivo'), (req, res) => {
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

app.put('/editar-nombre-archivo', (req, res) => {
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
app.post('/eliminar-archivo', (req, res) => {
  const { nombreArchivo } = req.body;

  const rutaArchivo = path.join(__dirname, 'uploads', nombreArchivo);

  fs.unlink(rutaArchivo, (err) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error al eliminar el archivo');
      }
      res.send('Archivo eliminado exitosamente');
  });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = connection;