// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const solicitudService = require('../services/solicitudService');

// Registro de nueva solicitud //
const creaSolicitud = async (req, res) => await respuestas.ok200(res, 'Solicitud Registrada', await solicitudService.creaSolicitud(req.body));

module.exports = { creaSolicitud }