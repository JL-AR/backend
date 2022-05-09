// Helpers //
const respuestas = require('../helpers/respuestas');
// Models //
const Servicio = require('../models/ServicioModel');

// Valida que el codigo de servicio enviado en body sea correspondiente //
const validaServicio = async (req, res, next) => {
    let codigo;
    req.body.servicio ? codigo = req.body.servicio : codigo = req.body.tipo;
    let servicio = await Servicio.findOne({ codigo: codigo }).exec();
    if (!servicio) return respuestas.error400(res, `El 'codigo' de servicio no corresponde a servicio en BD.`);
    next();
}

module.exports = { validaServicio }