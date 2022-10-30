const express = require('express');
const router = express.Router();
// Respuestas //
const respuestas = require('../helpers/respuestas');
// Rutas //
const solicitudRoutes = require('./solicitudRoute.js');
const reclamoRoutes = require('./reclamoRoutes');
const ordenTrabajoRoutes = require('./ordenTrabajoRoutes');

// Ruta prueba de conexion a API //
router.get('/', (req, res) => respuestas.ok200(res, 'Bienvenido', {}));
// Rutas p/ entidad Solicitud //
router.use('/solicitud', solicitudRoutes);
// Rutas p/ entidad Reclamo //
router.use('/reclamo', reclamoRoutes);
// Rutas p/ entidad Orden de Trabajo //
router.use('/ordenTrabajo', ordenTrabajoRoutes);

module.exports = router;