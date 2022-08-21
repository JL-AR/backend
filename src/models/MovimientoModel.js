const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Movimiento = new Schema({
    estado: { type: Schema.Types.ObjectId, ref: 'Estado'},
    observacion: { type: String },
    fecha: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model('Movimiento', Movimiento);