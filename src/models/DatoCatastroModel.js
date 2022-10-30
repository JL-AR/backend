const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const DatoCatastro = new Schema({
    seccion: { type: String },
    macizo: { type: String },
    parcela: { type: String },
    uf: { type: String }
});
 
module.exports = mongoose.model('DatosCatastrales', DatoCatastro);