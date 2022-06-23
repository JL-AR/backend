// Helpers //
const respuestas = require('../helpers/respuestas');
// Models //
const Calle = require('../models/CalleModel');
const Servicio = require('../models/ServicioModel');
const Estado = require('../models/EstadoModel');

// Valida campos obligatorios y numericos del body //
const validaCampos = async (req, res, next) => {
    if (!req.body.tipo) return respuestas.error400(res, `Se debe indicar el tipo de solicitud.`);
    if (!req.body.nombres) return respuestas.error400(res, `El campo 'nombres' es obligatorio.`);
    if (!req.body.apellidos) return respuestas.error400(res, `El campo 'apellidos' es obligatorio.`);
    if (!req.body.dni) return respuestas.error400(res, `El campo 'dni' es obligatorio.`);
    if (typeof(req.body.dni) != 'number') return respuestas.error400(res, `La propiedad 'dni' debe ser numerica.`);
    if (!req.body.direccion) return respuestas.error400(res, `Se debe indicar una 'direccion' correspondiente a la solicitud.`);
    if (!req.body.direccion.calle) return respuestas.error400(res, `Los datos de 'direccion.calle' es obligatorio.`);
    if (!req.body.direccion.numeracion) return respuestas.error400(res, `Los datos de 'direccion.numeracion' es obligatorio.`);
    if (!req.body.email) return respuestas.error400(res, `'email' es un campo obligatorio.`);
    // Se deja solo datos necesarios en body //
    req.body = {
        tipo: req.body.tipo,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        dni: req.body.dni,
        direccion: req.body.direccion,
        email: req.body.email
    }
    next();
}

// Valida campos p/ actualizacion de solicitud //
const validaCamposUpdate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return respuestas.error400(res, `Se debe indicar los campos a actualizar (tipo, tracking, nombres, apellidos, dni o direccion).`);
    if (req.body.tipo) {
        let servicio = await Servicio.findOne({ codigo: req.body.tipo }).exec();
        if (!servicio) return respuestas.error400(res, `El servicio '${req.body.tipo}' no corresponde.`);
    }
    if (req.body.tracking) {
        if (!req.body.tracking.estado || !req.body.tracking.observacion) return respuestas.error400(res, `Para actualizar tracking se debe indicar 'estado' y 'observacion.'`);
        let estado = await Estado.findOne({ codigo: req.body.tracking.estado }).exec();
        if (!estado) return respuestas.error400(res, `El estado '${req.body.tracking.estado}' no corresponde. Indique estado valido para actualizar tracking`);
    }
    if (req.body.direccion) {
        if (!req.body.direccion.calle || !req.body.direccion.numeracion) return respuestas.error400(res, `Para actualizar direccion se debe indicar 'calle' y 'numeracion.'`);
        let calle = await Calle.findOne({ codigo: req.body.direccion.calle }).exec();
        if (!calle) return respuestas.error400(res, `La calle '${req.body.direccion.calle}' no corresponde. Indique calle valida para actualizar direccion`);
    }

    next();
}

// Valida que el codigo de calle enviado en body sea correcto //
const validaCalle = async (req, res, next) => {
    let calle = await Calle.findOne({ codigo: req.body.direccion.calle}).exec();
    if (!calle) return respuestas.error400(res, "El codigo de 'calle' no corresponde.");
    next();
}

module.exports = { validaCampos, validaCalle, validaCamposUpdate }