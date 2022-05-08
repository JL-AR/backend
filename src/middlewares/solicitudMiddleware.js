// Helpers //
const respuestas = require('../helpers/respuestas');
const Servicio = require('../models/ServicioModel');
const Calle = require('../models/CalleModel');

// Valida campos obligatorios y numericos del body //
const validaCampos = async (req, res, next) => {
    if (!req.body.tipo) return respuestas.error400(res, `Se debe indicar el tipo de solicitud.`);
    if (!req.body.nombres) return respuestas.error400(res, `El campo 'nombres' es obligatorio.`);
    if (!req.body.apellidos) return respuestas.error400(res, `El campo 'apellidos' es obligatorio.`);
    if (!req.body.dni) return respuestas.error400(res, `El campo 'dni' es obligatorio.`);
    if (typeof(req.body.dni) != 'number') return respuestas.error400(res, `La propiedad 'dni' debe ser numerica.`);
    if (!req.body.direccion.calle) return respuestas.error400(res, `Los datos de 'direccion.calle' es obligatorio.`);
    if (!req.body.direccion.numeracion) return respuestas.error400(res, `Los datos de 'direccion.numeracion' es obligatorio.`);
    // Se deja solo datos necesarios en body //
    req.body = {
        tipo: req.body.tipo,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        dni: req.body.dni,
        direccion: req.body.direccion
    }
    next();
}

// Valida que el codigo de servicio enviado en body sea correspondiente //
const validaServicio = async (req, res, next) => {
    let servicio = await Servicio.findOne({ codigo: req.body.tipo }).exec();
    if (!servicio) return respuestas.error400(res, `El 'codigo' de servicio no corresponde a servicio en BD.`);
    next();
}

// Valida que el codigo de calle enviado en body sea correcto //
const validaCalle = async (req, res, next) => {

    let calle = await Calle.findOne({ codigo: req.body.direccion.calle}).exec();
    if (!calle) return respuestas.error400(res, "El codigo de 'calle' no corresponde.");
    next();
}

module.exports = { validaCampos, validaCalle, validaServicio }