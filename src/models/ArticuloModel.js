const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');
const  mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Articulo = new Schema({
    codigo: { type: String, required: true, index: true, unique: true },
    nombre: { type: String, required: true, index: true, unique: true },
    descripcion: { type: String },
    stock: { type: Number, required: true, text: true },
    alerta: { type: Number, required: true, text: true }
});

Articulo.plugin(mongoosePaginate);
Articulo.plugin(aggregatePaginate);
 
module.exports = mongoose.model('Articulo', Articulo);