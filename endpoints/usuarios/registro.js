const  {connection} = require('../conecction');
const express = require("express");
const router = express.Router();

const ExpReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/~`-]).+$/;

router.post('', (req, res) => {
  alert(req.body);  
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send(`
      <html>
        <head><title>Error de Confirmación</title></head>
        <body style="font-family: Arial, sans-serif; margin: 40px; color: orange;">
          <h1>Error de Confirmación</h1>
          <p>Las contraseñas no coinciden.</p>
          <button onclick="window.history.back()">Regresar</button>
        </body>
      </html>
    `);
  }

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
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Registro Exitoso</title>
                  <style>
                      body, html {
                          height: 100%;
                          margin: 0;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                      }
                      .cargador {
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          position: fixed;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          background-color:#03734A;
                          z-index: 9999;
                      }
                      .loader {
                          animation: rotate 1s infinite;
                          height: 50px;
                          width: 50px;
                      }
                      .loader:before,
                      .loader:after {
                          border-radius: 50%;
                          content: '';
                          display: block;
                          height: 20px;
                          width: 20px;
                      }
                      .loader:before {
                          animation: ball1 1s infinite;
                          background-color: #cb2025;
                          box-shadow: 30px 0 0 #f8b334;
                          margin-bottom: 10px;
                      }
                      .loader:after {
                          animation: ball2 1s infinite;
                          background-color: #00a096;
                          box-shadow: 30px 0 0 #97bf0d;
                      }
                      @keyframes rotate {
                          0% {
                              -webkit-transform: rotate(0deg) scale(0.8);
                              -moz-transform: rotate(0deg) scale(0.8);
                          }
              
                          50% {
                              -webkit-transform: rotate(360deg) scale(1.2);
                              -moz-transform: rotate(360deg) scale(1.2);
                          }
              
                          100% {
                              -webkit-transform: rotate(720deg) scale(0.8);
                              -moz-transform: rotate(720deg) scale(0.8);
                          }
                      }
              
                      @keyframes ball1 {
                          0% {
                              box-shadow: 30px 0 0 #f8b334;
                          }
              
                          50% {
                              box-shadow: 0 0 0 #f8b334;
                              margin-bottom: 0;
                              -webkit-transform: translate(15px,15px);
                              -moz-transform: translate(15px, 15px);
                          }
              
                          100% {
                              box-shadow: 30px 0 0 #f8b334;
                              margin-bottom: 10px;
                          }
                      }
              
                      @keyframes ball2 {
                          0% {
                              box-shadow: 30px 0 0 #97bf0d;
                          }
              
                          50% {
                              box-shadow: 0 0 0 #97bf0d;
                              margin-top: -20px;
                              -webkit-transform: translate(15px,15px);
                              -moz-transform: translate(15px, 15px);
                          }
              
                          100% {
                              box-shadow: 30px 0 0 #97bf0d;
                              margin-top: 0;
                          }
                      }
              
                      .registro-exitoso {
                          display: none;
                          text-align: center;
                          font-family: Arial, 
                          sans-serif; 
                          margin: 40px; color: green;
                      }
                  </style>
              </head>
              <body>
                  <div class="cargador" id="cargador">
                      <div class="loader"></div>
                  </div>
              
                  <div class="registro-exitoso" id="registroExitoso">
                      <h1>Usuario registrado con éxito</h1>
                      <p>¡Bienvenido a nuestra comunidad!</p>
                      <button onclick="window.history.back()">Regresar</button>
                  </div>
              
                  <script>
                      // Función para ocultar el cargador y mostrar el mensaje de registro exitoso
                      setTimeout(() => {
                          document.getElementById('cargador').style.display = 'none';
                          document.getElementById('registroExitoso').style.display = 'block';
                      }, 5000); // Ocultar después de 5 segundos (5000 milisegundos)
                  </script>
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

module.exports=router

