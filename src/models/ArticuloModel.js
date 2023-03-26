const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Articulo = new Schema({
    codigo: { type: String, required: true, index: true, unique: true },
    nombre: { type: String, required: true, index: true, unique: true },
    descripcion: { type: String },
    stock: { type: Number, required: true, text: true },
    alerta: { type: Number, required: true, text: true }
});
 
module.exports = mongoose.model('Articulo', Articulo);