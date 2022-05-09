// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const reclamoService = require('../services/reclamoService');

// Registro de nueva solicitud //
const creaReclamo = async (req, res) => await respuestas.ok200(res, 'Reclamo Registrado', await reclamoService.creaReclamo(req.body));

module.exports = { creaReclamo }