const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Domicilio = new Schema({
    calle: { type: Schema.Types.ObjectId, required: true },
    numeracion: { type: String, required: true},
    piso: { type: String },
    departamento: { type: String }
});
 
module.exports = mongoose.model('Domicilio', Domicilio);