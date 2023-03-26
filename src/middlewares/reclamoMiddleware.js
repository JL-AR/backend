// Helpers //
const respuestas = require('../helpers/respuestas');
const Reclamo = require('../models/ReclamoModel');
const Estado = require('../models/EstadoModel');
const Servicio = require('../models/ServicioModel');
const Calle = require('../models/CalleModel');

const validaCampos = async (req, res, next) => {
    if (!req.body.servicio) return respuestas.error400(res, `Se debe indicar 'servicio' al que corresponde el reclamo.`);
    if (!req.body.direccion) return respuestas.error400(res, `Se debe indicar un 'direccion' correspondiente el reclamo.`);
    if (!req.body.direccion.calle) return respuestas.error400(res, `Los datos de 'direccion.calle' es obligatorio.`);
    if (!req.body.direccion.numeracion) return respuestas.error400(res, `Los datos de 'direccion.numeracion' es obligatorio.`);
    next();
}

// Valida campos p/ actualizacion de reclamo //
const validaCamposUpdate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return respuestas.error400(res, `Se debe indicar los campos a actualizar (servicio, ultimo_estado, nombre, domicilio).`);
    if (req.body.servicio) {
        let servicio = await Servicio.findOne({ codigo: req.body.servicio }).exec();
        if (!servicio) return respuestas.error400(res, `El servicio '${req.body.servicio}' no corresponde.`);
    }
    if (req.body.ultimo_estado) {
        if (!req.body.ultimo_estado.estado) return respuestas.error400(res, `Para actualizar tracking se debe indicar 'estado'`);
        let estado = await Estado.findOne({ codigo: req.body.ultimo_estado.estado }).exec();
        if (!estado) return respuestas.error400(res, `El estado '${req.body.ultimo_estado.estado}' no corresponde. Indique estado valido para actualizar tracking`);
    }
    if (req.body.domicilio) {
        if (!req.body.domicilio.calle) return respuestas.error400(res, `Para actualizar domicilio se debe indicar 'calle'`);
        let calle = await Calle.findOne({ codigo: req.body.domicilio.calle }).exec();
        if (!calle) return respuestas.error400(res, `La calle '${req.body.domicilio.calle}' no corresponde. Indique calle valida para actualizar direccion`);
    }

    next();
}

// Valida existencia de reclamo //
const validaReclamoExistente = async (req, res, next) => {
    try {
        let reclamo = await Reclamo.findById(req.body._id).exec();
        if (!reclamo) return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a un reclamo.`);
    } catch (error) {
        return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a un reclamo.`);
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

module.exports = { validaCampos, validaCamposUpdate, validaReclamoExistente, verificaDatosBusqueda }