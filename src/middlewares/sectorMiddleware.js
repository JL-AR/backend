// Models //
const Sector = require('../models/SectorModel');
// Helper //
const respuestas = require('../helpers/respuestas');

// Valida que el id de Sector enviado en body sea correcto //
const validaExistencia = async (req, res, next) => {
    try {
        let sector = await Sector.findById(req.body.sector).exec();
        if (!sector) return respuestas.error400(res, `El id '${ req.body.sector }' no corresponde a un Sector.`);;
    } catch (error) {
        console.log(error);
        return respuestas.error400(res, `El id '${ req.body.sector }' no corresponde a un Sector.`);
    }
    next();
}

module.exports = { validaExistencia }