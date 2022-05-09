// Helpers //
const respuestas = require('../helpers/respuestas');
// Services //
const Servicio = require('../models/ServicioModel');
// Models //
const Calle = require('../models/CalleModel');

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

// Valida que el codigo de calle enviado en body sea correcto //
const validaCalle = async (req, res, next) => {

    let calle = await Calle.findOne({ codigo: req.body.direccion.calle}).exec();
    if (!calle) return respuestas.error400(res, "El codigo de 'calle' no corresponde.");
    next();
}

module.exports = { validaCampos, validaCalle }