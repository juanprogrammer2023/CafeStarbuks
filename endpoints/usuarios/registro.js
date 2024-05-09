
const ExpReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/~`-]).+$/;
//ENDPOINT PARA REGISTRARSE ACTUALIZACION//
router.post('/registrar', (req, res) => {
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


