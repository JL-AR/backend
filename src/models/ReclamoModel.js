const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');
const  mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Reclamo = new Schema({
    servicio: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
    domicilio: { type: Schema.Types.ObjectId, ref: 'Domicilio', required: true },
    nombre: { type: String },
    observaciones: { type: String },
    tracking: [{ type: Schema.Types.ObjectId, ref: 'Movimiento', required: true }],
    ultimo_estado: { type: Schema.Types.ObjectId, ref: 'Estado', required: true},
    email: { type: String, required: true },
    fecha_alta: { type: Date, default: Date.now, required: true },
});

Reclamo.plugin(mongoosePaginate);
Reclamo.plugin(aggregatePaginate);

module.exports = mongoose.model('Reclamo', Reclamo);