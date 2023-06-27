const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Empleado = new Schema({    
    legajo: { type: Number, required: true, unique: true, index: true, text: true},
    apellido: { type: String, required: true },
    nombre: { type: String, required: true },
    activo: { type: Boolean, default: true },
    sector: { type: Schema.Types.ObjectId, ref: 'Sector', required: true },
    dni: { type: Number, required: true, unique: true, index: true, text: true},
    telefono: { type: Number, text: true},
    domicilio: { type: Schema.Types.ObjectId, ref: 'Domicilio', required: true },
    telefono_referencia: { type: Number, text: true},
});

Empleado.plugin(mongoosePaginate);
Empleado.plugin(aggregatePaginate);
 
module.exports = mongoose.model('Empleado', Empleado, 'empleados');