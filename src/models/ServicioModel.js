const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Servicio = new Schema({
    codigo: { type: String },
    nombre: { type: String, required: true },
    descripcion : { type: String },
    detalle : { type: String },
    sector: { type: Schema.Types.ObjectId, ref: 'sector', required: true },
    criticidad: { type: String, required: true },
    nivel_criticidad: { type: Number, required: true, index: true, text: true}
});

Servicio.plugin(aggregatePaginate);
 
module.exports = mongoose.model('Servicio', Servicio);