const Empleado = require('../models/EmpleadoModel');
// Helper //
const respuestas = require('../helpers/respuestas');


const validaCamposCrear = async (req, res, next) => {
    if (!req.body.legajo) return respuestas.error400(res, `Se debe indicar un 'legajo' para el Empleado.`);
    if (!req.body.apellido) return respuestas.error400(res, `Se debe indicar un 'apellido' para el Empleado.`);
    if (!req.body.nombre) return respuestas.error400(res, `Se debe indicar un 'nombre' para el Empleado.`);
    if (!req.body.sector) return respuestas.error400(res, `Se debe indicar una 'sector' para el Empleado.`);
    if (!req.body.dni) return respuestas.error400(res, `Se debe indicar un 'dni' para el Empleado.`);
    if (!req.body.telefono) return respuestas.error400(res, `Se debe indicar un 'telefono' para el Empleado.`);
    if (!req.body.domicilio) return respuestas.error400(res, `Se debe indicar un 'domicilio' para el Empleado.`);
    if (!req.body.domicilio.calle) return respuestas.error400(res, `Se debe indicar una 'calle' para el 'domicilio' del Empleado.`);
    if (!req.body.domicilio.numeracion) return respuestas.error400(res, `Se debe indicar una 'numeracion' para el 'domicilio' del Empleado.`);
    next();
}

// Valida que el empleado no exista //
const validaInexistencia = async (req, res, next) => {

    let empleado = await Empleado.findOne({ legajo: req.body.legajo}).exec();
    if (empleado) return respuestas.error400(res, `Ya se registro un Empleado con el legajo: ${ req.body.legajo } `);
    empleado = await Empleado.findOne({ dni: req.body.dni}).exec();
    if (empleado) return respuestas.error400(res, `Ya se registro un Empleado con el DNI: ${ req.body.dni } `);
    next();
}

// Valida campos p/ actualizacion de articulo //
const validaCamposUpdate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return respuestas.error400(res, `Se debe indicar los campos a actualizar (legajo, apellido, nombre, sector, dni, telefono, domicilio).`);
    if (!req.body.legajo && !req.body.apellido && !req.body.nombre && !req.body.sector && !req.body.dni && !req.body.telefono, !req.body.domicilio) {
        return respuestas.error400(res, `Indique un campo valido para actualizar (legajo, apellido, nombre, sector, dni, telefono, domicilio).`);
    }
    next();
}

// Valida existencia de articulo //
const validaExistente = async (req, res, next) => {
    try {
        if (!req.body._id) {
            return respuestas.error400(res, `Por favor, indique el _id del Empleado a actualizar.`);
        }
        let empleado = await Empleado.findById(req.body._id).exec();
        if (!empleado) return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a un empleado.`);
    } catch (error) {
        return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a un empleado.`);
    }
    next();
}

module.exports = { validaInexistencia, validaCamposCrear, validaCamposUpdate, validaExistente }