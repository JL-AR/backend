const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Calle = new Schema({
    nombre: { type: String, required: true},
    descripcion: { type: String },
    barrio: { type: Schema.Types.ObjectId, required: true}
});
 
module.exports = mongoose.model('Calle', Calle);