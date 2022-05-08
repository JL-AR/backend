const express = require('express');
const router = express.Router();
// Respuestas //
const respuestas = require('../helpers/respuestas');
// Rutas //
const solicitudRoutes = require('./solicitudRoute.js');

// Ruta prueba de conexion a API //
router.get('/', (req, res) => respuestas.ok200(res, 'Bienvenido', {}));
// Rutas p/ entidad Solicitud //
router.use('/solicitud', solicitudRoutes);

module.exports = router;