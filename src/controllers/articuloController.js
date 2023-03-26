// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const articuloService = require('../services/articuloService');

// Registro de nuevo articulo //
const crea = async (req, res) => await respuestas.ok200(res, 'Articulo Registrado', await articuloService.crea(req.body));

module.exports = { crea }