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
    const nombre=document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword=document.getElementById('confirmPassword').value
    const registroBtn = document.getElementById('registroBtn');
    
    // Enviamos los datos al servidor para verificar el inicio de sesión
    fetch('http://18.188.216.108:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password,confirmPassword }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }
      return response.json();
    })
    .then(data => {
      const nombre = data.name.split(' ')[0]; // Obtener el primer nombre
      const url = `Manuales.html?nombre=${nombre}`;
    // Redirigir al usuario a la página de Manuales con el nombre como parámetro en la URL
    window.location.href = url;
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Error al iniciar sesión:La contraseña no coincide");
    });
  }
});











