const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Empleado = new Schema({    
    legajo: { type: Number, required: true, unique: true, index: true, text: true},
    apellido: { type: String, required: true },
    nombre: { type: String, required: true },
    activo: { type: Boolean, default: true },
    sector: { type: Schema.Types.ObjectId, ref: 'sector', required: true },
    dni: { type: Number, required: true, unique: true, index: true, text: true},
    telefono: { type: Number, text: true},
    domicilio: { type: Schema.Types.ObjectId, ref: 'Domicilio', required: true },
    telefono_referencia: { type: Number, text: true},
});
 
module.exports = mongoose.model('Empleado', Empleado);