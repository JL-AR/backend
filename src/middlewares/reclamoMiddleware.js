// Helpers //
const respuestas = require('../helpers/respuestas');

const validaCampos = async (req, res, next) => {
    if (!req.body.servicio) return respuestas.error400(res, `Se debe indicar 'servicio' al que corresponde el reclamo.`);
    if (!req.body.direccion) return respuestas.error400(res, `Se debe indicar un 'direccion' correspondiente el reclamo.`);
    if (!req.body.direccion.calle) return respuestas.error400(res, `Los datos de 'direccion.calle' es obligatorio.`);
    if (!req.body.direccion.numeracion) return respuestas.error400(res, `Los datos de 'direccion.numeracion' es obligatorio.`);
    next();
}

module.exports = { validaCampos }