// Models //
const Calle = require('../models/CalleModel');
// Helper //
const respuestas = require('../helpers/respuestas');

// Valida que el codigo de calle enviado en body sea correcto //
const validaCalle = async (req, res, next) => {

    let calle = await Calle.findOne({ codigo: req.body.direccion.calle}).exec();
    if (!calle) return respuestas.error400(res, "El codigo de 'calle' no corresponde.");
    next();
}

module.exports = { validaCalle }