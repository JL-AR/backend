const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Medidor = new Schema({
    numero: { type: Number },
    marca: { type: String },
    estado: { type: Number },
    observaciones: { type: String },
    domicilio: { type: Schema.Types.ObjectId, ref: 'domicilio', required: true }
});
 
module.exports = mongoose.model('Medidor', Medidor);