//connection.js//Server
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config({ path: __dirname + '/../.env' });
const SECRET_KEY=process.env.SECRET_KEY

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión establecida con la base de datos');
});

// Método para cerrar la conexión
function cerrarConexion() {
    connection.end((err) => {
        if (err) {
            console.error('Error al cerrar la conexión:', err);
            return;
        }
        console.log('Conexión cerrada correctamente');
    });
}



module.exports = { connection, cerrarConexion ,SECRET_KEY};


