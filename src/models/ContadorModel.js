const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Contador = new Schema({
    codigo: { type: String, required: true, unique: true },
    inicio: { type: Number, required: true},
    seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Contador', Contador);