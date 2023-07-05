const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const RolUsuario = new Schema({
    codigo: { type: String, required: true },
    menu_items : [{ type: Schema.Types.ObjectId, ref: 'ItemMenu' }]
});
 
module.exports = mongoose.model('RolUsuario', RolUsuario, 'rolesUsuario');