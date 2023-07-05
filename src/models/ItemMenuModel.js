const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const ItemMenu = new Schema({
    codigo: { type: String, required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String },
    url: { type: String, required: true },
    icono: { type: Boolean, default: false },
    submenu : { type: Schema.Types.ObjectId, ref: 'ItemMenu' }
});
 
module.exports = mongoose.model('ItemMenu', ItemMenu, 'itemsMenu');