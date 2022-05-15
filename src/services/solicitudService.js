const Solicitud = require('../models/SolicitudModel');
const Contador = require('../models/ContadorModel');
const Servicio = require('../models/ServicioModel');
const Domicilio = require('../models/DomicilioModel');
const Calle = require('../models/CalleModel');
const Estado = require('../models/EstadoModel');
const Movimiento = require('../models/MovimientoModel');

const creaSolicitud = async (datosSolicitud) => {
    const session = await Solicitud.startSession();
    session.startTransaction();

    try {
        // Buscando servicio p/ tipo de solicitud //
        let servicio = await Servicio.findOne({ codigo: datosSolicitud.tipo }).session(session).exec();

        // Buscando y estableciendoestado para tracking (Movimiento) //
        let estado = await Estado.findOne({ codigo: 'PENDIENTE' }).session(session).exec();
        let movimiento = await new Movimiento({
            estado: estado._id,
            observacion: 'Solicitud registrada y pendiente.'
        });
        await Movimiento.create([movimiento], {session: session});
        let tracking = [movimiento._id];

        let calle = await Calle.findOne({ codigo: datosSolicitud.direccion.calle }).session(session).exec();
        
        let domicilio = {
            calle: calle._id,
            numeracion: datosSolicitud.direccion.numeracion
        }
        if (datosSolicitud.direccion.piso) domicilio.piso = datosSolicitud.direccion.piso;
        if (datosSolicitud.direccion.departamento) domicilio.departamento = datosSolicitud.direccion.departamento;
        
        domicilio = await new Domicilio(domicilio);
        await Domicilio.create([domicilio], {session: session});
        
        await Contador.findOneAndUpdate({ codigo: 'SEQ-SOLICITUD'}, {$inc: { seq: 1} });
        let contador = await Contador.findOne({ codigo: 'SEQ-SOLICITUD'}).session(session).exec();

        let solicitud = await new Solicitud({
            numero: contador.seq,
            tipo: servicio.id,
            tracking: tracking,
            nombres: datosSolicitud.nombres,
            apellidos: datosSolicitud.apellidos,
            dni: datosSolicitud.dni,
            direccion: domicilio._id,
            email: datosSolicitud.email
        });
        
        await Solicitud.create([solicitud], { session: session });

        await session.commitTransaction();
        session.endSession();

        return solicitud;

    } catch(error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
    
}

// Informe general de solicitudes, se paginan los datos por pagina y cantidad por pagina mediante param options //
const informeSolicitud = async (options) => {
    options.populate = ['direccion', 'tipo', 'tracking'];
    return await Solicitud.paginate({}, options);
}

// Busqueda por proximidad en campos indexados //
const busca = async (options) => { 
    options.populate = ['direccion', 'tipo', 'tracking'];
    let val = String(options.valor);
    val = new RegExp(val, "ig")
    // Verifica si el valor a busacr es numerico o texto //
    let result;
    if (Number.isInteger(options.valor)) {
        let aggregate = Solicitud.aggregate().addFields({ num: { $toString: "$numero" }, dniStr: { $toString: "$dni" }});
        aggregate.match({$or: [{ num: val }, {dniStr: val}]}); 

        result = await Solicitud.aggregatePaginate(aggregate, options);
    } else {
        result = await Solicitud.paginate({
            $or: [{ nombres: { $regex: options.valor } },
            { apellidos: { $regex: options.valor }},
            { email: { $regex: options.valor }}]
        }, options); 
    }
    
    return result;
}

module.exports = { creaSolicitud, informeSolicitud, busca }