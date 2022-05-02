const { Schema } = require('mongoose');
const { mongoose } = require('../../db/mongoDb');

const OrdenTrabajo = new Schema({
    numero: { type: Number, required: true, unique: true },
    datos_catastrales: { type: Schema.Types.ObjectId, ref: 'datosCatastrales' },
    nro_expediente: { type:Number },
    observacion: { type: String },
    detalle_tecnico: { type: String },
    medidor: { type: Schema.Types.ObjectId, ref: 'medidor' },
    descripcion: { type: String },
    documentacion: { type: Schema.Types.ObjectId, ref: 'archivo' },
    materiales_conexion: [{ type: Schema.Types.ObjectId, ref: 'materialesSolicitud' }]
});
 
module.exports = mongoose.model('Servicio', Servicio);