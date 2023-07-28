const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Usuario = new Schema({ 
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    empleado: { type: Schema.Types.ObjectId, ref: 'Empleado', required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: 'RolUsuario', required: true }]
});

Usuario.plugin(mongoosePaginate);
Usuario.plugin(aggregatePaginate);
 
module.exports = mongoose.model('Usuario', Usuario);