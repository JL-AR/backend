const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Reclamo = new Schema({
    servicio: { type: Schema.Types.ObjectId, ref: 'servicio', required: true },
    domicilio: { type: Schema.Types.ObjectId, ref: 'domicilio', required: true },
    nombre: { type: String },
    observaciones: { type: String },
    tracking: [{ type: Schema.Types.ObjectId, ref: 'movimiento', required: true }],
    email: { type: String, required: true }
});

module.exports = mongoose.model('Reclamo', Reclamo);