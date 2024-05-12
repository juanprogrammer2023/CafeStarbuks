const express=require('express')
const router=express.Router();
const {connection}=require('../conecction')
const ExcelJS = require('exceljs');

router.get('/exportar-usuarios', (req, res) => {
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

  module.exports=router