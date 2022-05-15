// Helper //
const respuestas = require('../helpers/respuestas');

// Valida campos p/ paginar //
const validaCampos = async (req, res, next) => {
    if (!req.body.page || !req.body.limit) return respuestas.error400(res, "Indique pagina (page) y cant. por pagina (limit) para paginar resultados.");
    let valores = req.body;
    req.body = {};
    if (valores.valor) req.body.valor = valores.valor
    req.body.page = valores.page;
    req.body.limit = valores.limit;
    next();
}

module.exports = { validaCampos }