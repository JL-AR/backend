// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const listaMaterialesService = require('../services/listaMaterialesService');

// Registro de nueva lista //
const crea = async (req, res) => await respuestas.ok200(res, 'Lista de Materiales Registrada', await listaMaterialesService.crea(req.body));
// Informe lista //
const informe = async (req, res) => await respuestas.ok200(res, 'Informe de Materiales Registrada', await listaMaterialesService.informe(req.body));
// Actualiza articulo existente //
/*const actualiza = async (req, res) => await respuestas.ok200(res, 'Articulo Actualizado:', await articuloService.actualiza(req.body));
// Buscador //
const busca = async (req, res) => await respuestas.ok200(res, 'Resultado busqueda:', await articuloService.busca(req.body));*/

module.exports = { crea, informe, /*actualiza, busca*/ }