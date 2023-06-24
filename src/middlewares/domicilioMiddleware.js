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

const validaCallePorId = async (req, res, next) => {
    try {
        let calle = await Calle.findById(req.body.domicilio.calle).exec();
        if (!calle) return respuestas.error400(res, `El id '${ req.body.domicilio.calle }' no corresponde a una Calle.`);
    } catch (error) {
        return respuestas.error400(res, `El id '${ req.body.domicilio.calle }' no corresponde a una Calle.`);
    }    
    next();
}

module.exports = { validaCalle, validaCallePorId }