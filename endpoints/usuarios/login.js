// login.js
const express = require('express');
const router = express.Router();
const connection = require('/home/ubuntu/StarbucksProject/Database.js');

// Endpoint para el login
router.post('/login', (req, res) => {
  
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

module.exports = router;
