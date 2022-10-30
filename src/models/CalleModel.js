const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Calle = new Schema({
    codigo: { type: String, required: true},
    nombre: { type: String, required: true},
    descripcion: { type: String }
});
 
module.exports = mongoose.model('Calle', Calle);