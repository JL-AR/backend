// Helper //
const respuestas = require('../helpers/respuestas');

// Valida campos p/ paginar //
const validaCampos = async (req, res, next) => {
    if (!req.body.page || !req.body.limit) return respuestas.error400(res, "Indique pagina (page) y cant. por pagina (limit) para paginar resultados.");
    req.body = {
        page: req.body.page,
        limit: req.body.limit
    }
    next();
}

module.exports = { validaCampos }