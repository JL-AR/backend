const Articulo = require('../models/ArticuloModel');
const ListadoMateriales = require('../models/ListaMaterialesModel');
// Helper //
const respuestas = require('../helpers/respuestas');

const validaCamposCrear = async (req, res, next) => {
    if (!req.body.codigo) return respuestas.error400(res, `Se debe indicar un 'codigo' para el Listado de Materiales.`);
    if (!req.body.descripcion) return respuestas.error400(res, `Se debe indicar una 'descripcion' para el Listado de Materiales.`);
    if (!req.body.articulos || !Array.isArray(req.body.articulos) || req.body.articulos.length == 0) return respuestas.error400(res, `Se debe indicar los 'articulos' para el Listado de Materiales.`);
    next();
}

// Valida que el articulo exista //
const validaExistenciaArticulos = async (req, res, next) => {
    req.body.articulos.forEach(async element => {
        try {
            if (!element.articulo) return respuestas.error400(res, `Debe indicar el id del Articulo`);
            let articulo = await Articulo.findById(element.articulo).exec();
            if (!articulo) return respuestas.error400(res, `El id '${ element.articulo }' no corresponde a un Articulo`);
        } catch (error) {
            return respuestas.error400(res, `El id '${ element.articulo }' no corresponde a un Articulo.`);
        }
    });
    next();
}

// Valida que el articulo no exista //
const validaInexistencia = async (req, res, next) => {
    let lista = await ListadoMateriales.findOne({ codigo: req.body.codigo }).exec();
    if (lista) return respuestas.error400(res, `Ya se registro una Lista de Materiales con el codigo: ${ req.body.codigo } `);
    next();
}

// Valida campos p/ actualizacion de lista de materiales //
const validaCamposUpdate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return respuestas.error400(res, `Se debe indicar los campos a actualizar (codigo, descripcion, articulos).`);
    if (!req.body.codigo && !req.body.descripcion && !req.body.articulos) {
        return respuestas.error400(res, `Indique un campo valido para actualizar (codigo, descripcion, articulos).`);
    }
    if (!Array.isArray(req.body.articulos)) {
        return respuestas.error400(res, `El campo 'articulos' debe ser un Array`);
    }
    next();
}

// Valida existencia de lista de materiales //
const validaExistente = async (req, res, next) => {
    try {
        if (!req.body._id) {
            return respuestas.error400(res, `Por favor, indique el _id de la lista de materiales a actualizar.`);
        }
        let listado = await ListadoMateriales.findById(req.body._id).exec();
        if (!listado) return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a una lista de materiales`);
    } catch (error) {
        return respuestas.error400(res, `El id '${ req.body._id }' no corresponde a una lista de materiales.`);
    }
    next();
}

module.exports = { validaCamposCrear, validaExistenciaArticulos, validaInexistencia, validaCamposUpdate, validaExistente }