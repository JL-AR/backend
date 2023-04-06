// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const listaMaterialesService = require('../services/listaMaterialesService');

// Registro de nuevo articulo //
const crea = async (req, res) => await respuestas.ok200(res, 'Lista de Materiales Registrada', await listaMaterialesService.crea(req.body));
// Informe de articulos //
/*const informe = async (req, res) => await respuestas.ok200(res, 'Listado de Articulos', await articuloService.informe(req.body));
// Actualiza articulo existente //
const actualiza = async (req, res) => await respuestas.ok200(res, 'Articulo Actualizado:', await articuloService.actualiza(req.body));
// Buscador //
const busca = async (req, res) => await respuestas.ok200(res, 'Resultado busqueda:', await articuloService.busca(req.body));*/

module.exports = { crea, /*informe, actualiza, busca*/ }