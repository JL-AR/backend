const express = require('express');
const router = express.Router();
// Respuestas //
const respuestas = require('../helpers/respuestas');

// Ruta prueba de conexion a API //
router.get('/', (req, res) => respuestas.ok200(res, 'Bienvenido', {}));

module.exports = router;