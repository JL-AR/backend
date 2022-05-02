const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const Solicitud = new Schema({
    numero: { type: Number, required: true, unique: true },
    tipo: { type: Schema.Types.ObjectId, ref: 'servicio', required: true },
    tracking: [{ type: Schema.Types.ObjectId, ref: 'movimiento', required: true }],
    fecha_alta: { type: Date, default: Date.now, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    dni: { type: Number, required: true, max: 9 },
    direccion: { type: Schema.Types.ObjectId, ref: 'domicilio', required: true },
    documentacion: { type: Boolean, default: false },
    ordenTrabajo: { type: Schema.Types.ObjectId, ref: 'ordenTrabajo' }
});
 
module.exports = mongoose.model('Solicitud', Solicitud);