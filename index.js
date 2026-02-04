const express = require('express');
const app = express();
const port = 3000;

// Importar el archivo de rutas de usuarios
const usuariosRouter = require('./pages/usuarios');
const productosRouter = require('./pages/productos.js');

app.use('/usuarios', usuariosRouter); // Usar el router para la ruta /usuarios
app.use('/productos', productosRouter); // Usar el router para la ruta /productos

app.get('/', (req, res) => {
    res.send('Página principal de mi ejercicio de Express');
});

//Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http:localhost:${port}`);
});



