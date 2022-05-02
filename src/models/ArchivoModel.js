const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Archivo = new Schema({
    codigo: { type: String },
    tamanio: { type: Number, required: true },
    file: { type: Blob, required: true },
    extension: { type: String, required: true },
    descripcion: { type: String }
});
 
module.exports = mongoose.model('Archivo', Archivo);