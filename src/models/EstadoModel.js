const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Estado = new Schema({
    nombre: { type: String, required: true },
    codigo: { type: String },
    descripcion: { type: String }
});
 
module.exports = mongoose.model('Estado', Estado);