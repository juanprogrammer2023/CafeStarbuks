document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("loginBtn").addEventListener("click", function() {
    login();
  });

  // Event listener para el campo de contraseña
  document.getElementById("password").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      login();
    }
  });

  // Event listener para el campo de correo electrónico
  document.getElementById("email").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      login();
    }
  });

  function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const registroBtn = document.getElementById('registroBtn');

    // Enviamos los datos al servidor para verificar el inicio de sesión
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }
      return response.json();
    })
    .then(data => {
      window.location.href = 'Manuales.html';
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Error al iniciar sesión");
    });
  }
});











