const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const ListadoMateriales = new Schema({    
    codigo: { type: String, required: true },
    descripcion: { type: String, required: true },
    articulos: [{
        articulo: { type: Schema.Types.ObjectId, ref: 'Articulo', required: true },
        cantidad: { type: Number, required: true, text: true}
    }]
});
 
module.exports = mongoose.model('ListadoMateriales', ListadoMateriales);