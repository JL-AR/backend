const express = require('express');
const router = express.Router();
// Respuestas //
const respuestas = require('../helpers/respuestas');
// Rutas //
const solicitudRoutes = require('./solicitudRoute.js');
const reclamoRoutes = require('./reclamoRoutes');
const ordenTrabajoRoutes = require('./ordenTrabajoRoutes');
const articuloRoutes = require('./articuloRoutes');
const listaMaterialesRoutes = require('./listaMaterialesRoutes');
const empleadoRoutes = require('./empleadoRoutes');
const usuarioRoutes = require('./usuarioRoutes');

// Ruta prueba de conexion a API //
router.get('/', (req, res) => respuestas.ok200(res, 'Bienvenido', {}));
// Rutas p/ entidad Solicitud //
router.use('/solicitud', solicitudRoutes);
// Rutas p/ entidad Reclamo //
router.use('/reclamo', reclamoRoutes);
// Rutas p/ entidad Orden de Trabajo //
router.use('/ordenTrabajo', ordenTrabajoRoutes);
// Rutas p/ entidad Articulo //
router.use('/articulo', articuloRoutes);
// Rutas p/ entidad ListaMateriales //
router.use('/listamateriales', listaMaterialesRoutes);
// Rutas p/ entidad Empleado //
router.use('/empleado', empleadoRoutes);
// Rutas p/ entidad Usuario //
router.use('/usuario', usuarioRoutes);

module.exports = router;