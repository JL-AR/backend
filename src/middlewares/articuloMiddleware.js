const Articulo = require('../models/ArticuloModel');
// Helper //
const respuestas = require('../helpers/respuestas');

// Valida que el articulo no exista //
const validaInexistencia = async (req, res, next) => {

    let articulo = await Articulo.findOne({ codigo: req.body.codigo}).exec();
    if (articulo) return respuestas.error400(res, `Ya se registro un Articulo con el codigo: ${ req.body.codigo } `);
    articulo = await Articulo.findOne({ nombre: req.body.nombre}).exec();
    if (articulo) return respuestas.error400(res, `Ya se registro un Articulo con el nombre: ${ req.body.nombre } `);
    next();
}

const validaCamposCrear = async (req, res, next) => {
    if (!req.body.codigo) return respuestas.error400(res, `Se debe indicar un 'codigo' para el Articulo.`);
    if (!req.body.nombre) return respuestas.error400(res, `Se debe indicar un 'nombre' para el Articulo.`);
    if (!req.body.descripcion) return respuestas.error400(res, `Se debe indicar una 'descripcion' para el Articulo.`);
    if (!req.body.stock) return respuestas.error400(res, `Se debe indicar un 'stock' para el Articulo.`);
    if (!req.body.alerta) return respuestas.error400(res, `Se debe indicar una cantidad que servira de 'alerta' para la reposicion de stock del Articulo.`);
    next();
}

// Valida campos p/ actualizacion de articulo //
const validaCamposUpdate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return respuestas.error400(res, `Se debe indicar los campos a actualizar (codigo, nombre, descripcion, stock o alerta).`);
    if (!req.body.codigo && !req.body.nombre && !req.body.descripcion && !req.body.stock && !req.body.alerta) {
        return respuestas.error400(res, `Indique un campo valido para actualizar (codigo, nombre, descripcion, stock o alerta).`);
    }
    next();
}

// Valida existencia de articulo //
const validaExistente = async (req, res, next) => {
    try {
        if (!req.body._id) {
            return respuestas.error400(res, `Por favor, indique el _id del Articulo a actualizar.`);
        }
        let articulo = await Articulo.findById(req.body._id).exec();
        if (!articulo) return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a un articulo.`);
    } catch (error) {
        return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a un articulo.`);
    }
    next();
}

module.exports = { validaInexistencia, validaCamposCrear, validaCamposUpdate, validaExistente }