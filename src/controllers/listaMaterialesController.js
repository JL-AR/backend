// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const listaMaterialesService = require('../services/listaMaterialesService');

// Registro de nueva lista //
const crea = async (req, res) => await respuestas.ok200(res, 'Lista de Materiales Registrada', await listaMaterialesService.crea(req.body));
// Informe lista //
const informe = async (req, res) => await respuestas.ok200(res, 'Listas de Materiales Registradas', await listaMaterialesService.informe(req.body));
// Actualiza lista existente //
const actualiza = async (req, res) => await respuestas.ok200(res, 'Listas de Materiales Actualizada:', await listaMaterialesService.actualiza(req.body));
// Buscador //
/*const busca = async (req, res) => await respuestas.ok200(res, 'Resultado busqueda:', await articuloService.busca(req.body));*/

module.exports = { crea, informe, actualiza, /*busca*/ }