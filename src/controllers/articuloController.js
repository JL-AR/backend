// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const articuloService = require('../services/articuloService');

// Registro de nuevo articulo //
const crea = async (req, res) => await respuestas.ok200(res, 'Articulo Registrado', await articuloService.crea(req.body));
// Informe de articulos //
const informe = async (req, res) => await respuestas.ok200(res, 'Listado de Articulos', await articuloService.informe(req.body));
// Actualiza articulo existente //
const actualiza = async (req, res) => await respuestas.ok200(res, 'Articulo Actualizado:', await articuloService.actualiza(req.body));

module.exports = { crea, informe, actualiza }