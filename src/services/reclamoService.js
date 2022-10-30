// Models //
const Movimiento = require('../models/MovimientoModel');
const Reclamo = require('../models/ReclamoModel');
const Domicilio = require('../models/DomicilioModel');
const Servicio = require('../models/ServicioModel');
const Estado = require('../models/EstadoModel');
const Calle = require('../models/CalleModel');

const creaReclamo = async (datosReclamo) => {
    const session = await Reclamo.startSession();
    session.startTransaction();
    try {
        // Buscando servicio p/ tipo de reclamo //
        let servicio = await Servicio.findOne({ codigo: datosReclamo.servicio }).session(session).exec();

        // Buscando y estableciendoestado para tracking (Movimiento) //
        let estado = await Estado.findOne({ codigo: 'PENDIENTE' }).session(session).exec();
        let movimiento = await new Movimiento({
            estado: estado._id,
            observacion: 'Reclamo registrado y pendiente.'
        });
        await Movimiento.create([movimiento], {session: session});
        let tracking = [movimiento._id];

        // Creando domicilio para ubicacion de reclamo //
        let calle = await Calle.findOne({ codigo: datosReclamo.direccion.calle }).session(session).exec();
        let domicilio = {
            calle: calle._id,
            numeracion: datosReclamo.direccion.numeracion
        }
        if (datosReclamo.direccion.piso) domicilio.piso = datosReclamo.direccion.piso;
        if (datosReclamo.direccion.departamento) domicilio.departamento = datosReclamo.direccion.departamento;        
        domicilio = await new Domicilio(domicilio);
        await Domicilio.create([domicilio], {session: session});

        // Creando reclamo //
        let reclamo = {
            servicio: servicio._id,
            domicilio: domicilio._id,
            tracking: tracking,
            ultimo_estado: estado._id
        }
        if (datosReclamo.nombre) reclamo.nombre = datosReclamo.nombre;
        if (datosReclamo.observaciones) reclamo.observaciones = datosReclamo.observaciones;
        if (datosReclamo.email) reclamo.email = datosReclamo.email;

        await Reclamo.create([reclamo], {session: session});
        
        await session.commitTransaction();
        session.endSession();

        let populate = ['domicilio', { path: 'domicilio', populate: { path: 'calle', model: 'Calle'}}, 'servicio', 'tracking', { path: 'tracking', populate: { path: 'estado', model: 'Estado' }}, 'ultimo_estado'];
        await Reclamo.populate([reclamo], populate);

        return reclamo;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

// Informe general de solicitudes, se paginan los datos por pagina y cantidad por pagina mediante param options //
const informeReclamo = async (options) => {
    options.populate = ['domicilio', { path: 'domicilio', populate: { path: 'calle', model: 'Calle'}}, 'tracking', { path: 'tracking', populate: { path: 'estado', model: 'Estado' }}, 'ultimo_estado'];
      
    let aggregate = Reclamo.aggregate([{
        $lookup: {
            "from": "servicios",
            "localField": "servicio",
            "foreignField": "_id",
            "as": "servicio"
        }
    }]).addFields({
        nivel_criticidad: { $arrayElemAt: ["$servicio.nivel_criticidad", 0]}
    }).sort('-nivel_criticidad');
    result = await Reclamo.aggregatePaginate(aggregate, options);
    await Reclamo.populate(result.docs, options.populate);
    return result;
}

module.exports = { creaReclamo, informeReclamo }