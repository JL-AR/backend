// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const ordenTrabajoService = require('../services/ordenTrabajoService');

// Registro de nueva OT //
const creaOT = async (req, res) => await respuestas.ok200(res, 'OT Registrada', await ordenTrabajoService.creaOT(req.body));

module.exports = { creaOT }