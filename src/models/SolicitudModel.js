const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');
const  mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Solicitud = new Schema({
    numero: { type: Number, required: true, unique: true, index: true, text: true},
    tipo: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
    tracking: [{ type: Schema.Types.ObjectId, ref: 'Movimiento', required: true }],
    ultimo_estado: { type: Schema.Types.ObjectId, ref: 'Estado', required: true},
    fecha_alta: { type: Date, default: Date.now, required: true },
    nombres: { type: String, required: true, index: true, text: true},
    apellidos: { type: String, required: true, index: true, text: true },
    dni: { type: Number, required: true, max: 99999999, index: true, text: true },
    direccion: { type: Schema.Types.ObjectId, ref: 'Domicilio', required: true },
    documentacion: { type: Boolean, default: false },
    orden_trabajo: { type: Schema.Types.ObjectId, ref: 'ordenTrabajo' },
    email: { type: String, required: true, index: true, text: true }
});

Solicitud.plugin(mongoosePaginate);
Solicitud.plugin(aggregatePaginate);

module.exports = mongoose.model('Solicitud', Solicitud, 'solicitudes');