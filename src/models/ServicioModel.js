const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Servicio = new Schema({
    codigo: { type: String },
    nombre: { type: String, required: true },
    descripcion : { type: String },
    detalle : { type: String },
    sector: { type: Schema.Types.ObjectId, ref: 'sector', required: true }
});
 
module.exports = mongoose.model('Servicio', Servicio);