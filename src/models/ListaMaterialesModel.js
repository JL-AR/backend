const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');
const  mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ListadoMateriales = new Schema({    
    codigo: { type: String, required: true },
    descripcion: { type: String, required: true },
    articulos: [{
        articulo: { type: Schema.Types.ObjectId, ref: 'Articulo', required: true },
        cantidad: { type: Number, required: true, text: true}
    }]
});

ListadoMateriales.plugin(mongoosePaginate);
ListadoMateriales.plugin(aggregatePaginate);
 
module.exports = mongoose.model('ListadoMateriales', ListadoMateriales);