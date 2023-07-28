const Joi = require('joi');
const Usuario = require('../models/UsuarioModel');
const Empleado = require('../models/EmpleadoModel');
// Helper //
const respuestas = require('../helpers/respuestas');

const validaCamposCrear = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return respuestas.error400(res, `Se debe indicar los campos (username, empleado, roles[]).`);
    if (!req.body.username) return respuestas.error400(res, `Se debe indicar un 'username' para el Usuario.`);
    if (!req.body.empleado) return respuestas.error400(res, `Se debe indicar un 'empleado' para el Usuario.`);
    if (!req.body.roles || !Array.isArray(req.body.roles) || req.body.roles.length == 0) return respuestas.error400(res, `Se debe indicar los 'roles'([]) para el Listado de Materiales.`);
    next();
}

const schemaRegister = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    repeat_password: Joi.ref('password')
});

const validaRegistro = async (req, res, next) => {
    let datosRegistros = Object.assign({}, req.body);
    delete datosRegistros.empleado;
    delete datosRegistros.roles;
    const { error } = schemaRegister.validate(datosRegistros);
    if (error) return respuestas.error400(res, error.details[0].message)    
    next()
}

// Valida que el Usuario no exista //
const validaInexistencia = async (req, res, next) => {

    let usuario = await Usuario.findOne({ username: req.body.username}).exec();
    if (usuario) return respuestas.error400(res, `Ya se registro un Usuario con el username: ${ req.body.username } `);
    usuario = await Usuario.findOne({ empleado: req.body.empleado}).exec();
    if (usuario) {
        let empleado = await Empleado.findById(req.body.empleado).exec();
        return respuestas.error400(res, `Ya se registro un Usuario para el Empleado: ${ empleado.nombre } ${ empleado.apellido }`);
    } 
    next();
}

/*/ Valida campos p/ actualizacion de articulo //
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
}*/

module.exports = { validaInexistencia, validaCamposCrear, validaRegistro/*, validaCamposUpdate, validaExistente*/ }