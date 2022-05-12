const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');
const  mongoosePaginate = require('mongoose-paginate-v2');

const Solicitud = new Schema({
    numero: { type: Number, required: true, unique: true },
    tipo: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
    tracking: [{ type: Schema.Types.ObjectId, ref: 'Movimiento', required: true }],
    fecha_alta: { type: Date, default: Date.now, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    dni: { type: Number, required: true, max: 99999999 },
    direccion: { type: Schema.Types.ObjectId, ref: 'Domicilio', required: true },
    documentacion: { type: Boolean, default: false },
    ordenTrabajo: { type: Schema.Types.ObjectId, ref: 'ordenTrabajo' },
    email: { type: String, required: true}
});

Solicitud.plugin(mongoosePaginate);

module.exports = mongoose.model('Solicitud', Solicitud);