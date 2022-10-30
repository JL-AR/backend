const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Sector = new Schema({
    codigo: { type: String },
    nombre: { type: String, required: true },
    activo: { type: Boolean, default: false },
    descripcion : { type: String }
});
 
module.exports = mongoose.model('Sector', Sector);