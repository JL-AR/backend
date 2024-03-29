// Helpers //
const respuestas = require('../helpers/respuestas');
// Models //
const Calle = require('../models/CalleModel');
const Servicio = require('../models/ServicioModel');
const Estado = require('../models/EstadoModel');
const Solicitud = require('../models/SolicitudModel');

// Valida campos obligatorios y numericos del body //
const validaCampos = async (req, res, next) => {
    if (!req.body.tipo) return respuestas.error400(res, `Se debe indicar el tipo de solicitud.`);
    if (!req.body.nombres) return respuestas.error400(res, `El campo 'nombres' es obligatorio.`);
    if (!req.body.apellidos) return respuestas.error400(res, `El campo 'apellidos' es obligatorio.`);
    if (!req.body.dni) return respuestas.error400(res, `El campo 'dni' es obligatorio.`);
    if (typeof(req.body.dni) != 'number') return respuestas.error400(res, `La propiedad 'dni' debe ser numerica.`);
    if (req.body.dni && req.body.dni > 99999999) return respuestas.error400(res, `El DNI debe ser menor a 99999999.`);
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
    if (Object.keys(req.body).length === 0) return respuestas.error400(res, `Se debe indicar los campos a actualizar (tipo, ultimo_estado, nombres, apellidos, dni o direccion).`);
    if (req.body.tipo) {
        let servicio = await Servicio.findOne({ codigo: req.body.tipo }).exec();
        if (!servicio) return respuestas.error400(res, `El servicio '${req.body.tipo}' no corresponde.`);
    }
    if (req.body.ultimo_estado) {
        if (!req.body.ultimo_estado.estado) return respuestas.error400(res, `Para actualizar el ultimo_estado se debe indicar 'estado'`);
        let estado = await Estado.findOne({ codigo: req.body.ultimo_estado.estado }).exec();
        if (!estado) return respuestas.error400(res, `El estado '${req.body.ultimo_estado.estado}' no corresponde. Indique estado valido para actualizar tracking`);
    }
    if (req.body.direccion) {
        if (!req.body.direccion.calle || !req.body.direccion.numeracion) return respuestas.error400(res, `Para actualizar direccion se debe indicar 'calle' y 'numeracion.'`);
        let calle = await Calle.findOne({ codigo: req.body.direccion.calle }).exec();
        if (!calle) return respuestas.error400(res, `La calle '${req.body.direccion.calle}' no corresponde. Indique calle valida para actualizar direccion`);
    }
    if (req.body.dni && req.body.dni > 99999999) return respuestas.error400(res, `El DNI debe ser menor a 99999999.`);
    if (req.body.documentacion && typeof(req.body.documentacion) != 'boolean') return respuestas.error400(res, `La propiedad 'documentacion' debe ser de tipo booleano.`);

    next();
}

// Valida que el codigo de calle enviado en body sea correcto //
const validaCalle = async (req, res, next) => {
    let calle = await Calle.findOne({ codigo: req.body.direccion.calle}).exec();
    if (!calle) return respuestas.error400(res, "El codigo de 'calle' no corresponde.");
    next();
}

// Valida existencia de solicitud //
const validaSolicitudExistente = async (req, res, next) => {
    try {
        let solicitud = await Solicitud.findById(req.body._id).exec();
        if (!solicitud) return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a una solicitud.`);
    } catch (error) {
        return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a una solicitud.`);
    }
    next();
}

const verificaDatosBusqueda = async (req, res, next) => {
    if (!req.body.page) req.body.page = 1;
    if (!req.body.limit) req.body.limit = 10;
    if (!req.body.campo) req.body.campo = "";
    if (!req.body.valor) req.body.valor = "";
    next();
}

module.exports = { validaCampos, validaCalle, validaCamposUpdate, verificaDatosBusqueda, validaSolicitudExistente }