const express = require('express');
const app = express();//Ejecuta express y recibe un objeto
const path = require('path');
const routes = require('./routes/index');

// settings (definimos las configuraciones de express)
app.set('port', process.env.PORT || 3000);// Configuro un puerto el cual va a escuchar en un puerto definido, si no tenemos uno definido entonces por default usa el 3000
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// middlewares(escribimos los middlewares utilizados en esta app, ofrecen servicios y funciones comunes para las aplicaciones)
app.use(express.json());//reconoce el objeto de solicitud entrante como un objeto JSON
app.use(express.urlencoded({ extended: true }));

// routes
app.use(routes);


// start the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})//Inicializo express