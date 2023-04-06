// Helper //
const respuestas = require('../helpers/respuestas');

// Valida campos p/ paginar //
const validaCampos = async (req, res, next) => {
    if (!req.body.page || !req.body.limit) return respuestas.error400(res, "Indique pagina (page) y cant. por pagina (limit) para paginar resultados.");
    next();
}

const verificaDatosBusqueda = async (req, res, next) => {
    if (!req.body.page) req.body.page = 1;
    if (!req.body.limit) req.body.limit = 10;
    if (!req.body.campo) req.body.campo = "";
    if (!req.body.valor) req.body.valor = "";
    next();
}

module.exports = { validaCampos, verificaDatosBusqueda }