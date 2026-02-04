const express = require('express');
const router = express.Router(); //Esto crea el objeto router

//ruta para la página de usuarios
router.get('/', (req, res) => {
    res.send('Bienvenido a la página de usuarios');
});

//Ruta dinámica para un usuario específico /usuarios/:id
router.get('/:id', (req, res) => {
    res.send(`Detalles del usuario con ID: ${req.params.id}`);
});

module.exports = router; //Exporta el router para usarlo en otros archivos