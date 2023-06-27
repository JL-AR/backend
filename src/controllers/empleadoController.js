// Helper //
const respuestas = require('../helpers/respuestas');
// Services //
const empleadoService = require('../services/empleadoService');

// Registro de nuevo empleado //
const crea = async (req, res) => await respuestas.ok200(res, 'Empleado Registrado', await empleadoService.crea(req.body));
// Informe de articulos //
const informe = async (req, res) => await respuestas.ok200(res, 'Listado de Empleados', await empleadoService.informe(req.body));
// Actualiza articulo existente //
const actualiza = async (req, res) => await respuestas.ok200(res, 'Empleado Actualizado:', await empleadoService.actualiza(req.body));
// Buscador //
const busca = async (req, res) => await respuestas.ok200(res, 'Resultado busqueda:', await empleadoService.busca(req.body));

module.exports = { crea, informe, actualiza, busca }