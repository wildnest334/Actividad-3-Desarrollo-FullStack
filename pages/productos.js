const express = require('express');
const router = express.Router(); // Crear el objeto router.

//Ruta para la pagina princpal de usuarios: /Usuarios
router.get('/', (req, res) => {
    res.send('Bienvenido a la pagina De Productos');
});

// Ruta dinamica para un usuario especifico: /usuarios/:id
router.get('/:id', (req, res) => {
    res.send(`Detalles del usuario con ID: ${req.params.id}`);
});

module.exports = router; // Exportar el router para usarlo en la aplicacion principal.