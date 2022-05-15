// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const solicitudService = require('../services/solicitudService');

// Registro de nueva solicitud //
const creaSolicitud = async (req, res) => await respuestas.ok200(res, 'Solicitud Registrada', await solicitudService.creaSolicitud(req.body));
// Informe de solicitudes //
const informeSolicitud = async (req, res) => await respuestas.ok200(res, 'Listado de solicitudes', await solicitudService.informeSolicitud(req.body));
// Buscador por proximidad //
const busca = async (req, res) => await respuestas.ok200(res, 'Resultado busqueda:', await solicitudService.busca(req.body));

module.exports = { creaSolicitud, informeSolicitud, busca }