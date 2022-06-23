// Modelos //
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
    /*if (Number.isInteger(options.valor)) {
        let aggregate = Solicitud.aggregate().addFields({ num: { $toString: "$numero" }, dniStr: { $toString: "$dni" }});
        aggregate.match({$or: [{ num: val }, {dniStr: val}]}); 

        result = await Solicitud.aggregatePaginate(aggregate, options);
    } else {
        result = await Solicitud.paginate({
            $or: [{ nombres: { $regex: options.valor } },
            { dni: { $regex: options.valor } },
            { apellidos: { $regex: options.valor }},
            { email: { $regex: options.valor }}]
        }, options); 
    }*/
 
    let condiciones;
    // Validacion de ingreso numerico o string //
    let valor = parseInt(options.valor);
    if (!isNaN(valor)) {
        let aggregate = Solicitud.aggregate().addFields({ num: { $toString: "$numero" }, dniStr: { $toString: "$dni" }});
        console.log(String(valor));
        aggregate.match({$or: [{ "num": { $regex: String(valor) } }, {"dniStr": { $regex: String(valor) }}]}); 
        result = await Solicitud.aggregatePaginate(aggregate, options);
    } else {
        condiciones = [{ nombres: { $regex: options.valor } },
            { apellidos: { $regex: options.valor }},
            { email: { $regex: options.valor }}];
        result = await Solicitud.paginate({
                $or: condiciones
            }, options);     
    }  
    
    return result;
}

const actualizaSolicitud = async (datosNuevos) => {
    const session = await Solicitud.startSession();
    session.startTransaction();
    let datos = {};

    try {

        let solicitud = await Solicitud.findOne({ _id: datosNuevos._id }).session(session).exec();
        // update p/ tipo de servicio //
        if (datosNuevos.tipo) {
            let servicio = await Servicio.findOne({ codigo: datosNuevos.tipo }).session(session).exec();
            datos.tipo = servicio._id;
        }

        // update de tracking (se agrega movimiento) //
        if (datosNuevos.tracking) {
            let estado = await Estado.findOne({ codigo: datosNuevos.tracking.estado}).session(session).exec();
            let movimiento = await new Movimiento({
                estado: estado._id,
                descripcion: datosNuevos.tracking.descripcion
            });

            await Movimiento.create([movimiento], { session: session });

            solicitud.tracking.push(movimiento._id);
            await solicitud.save(session);
        }

        // update de nombres, apellidos y dni //
        if (datosNuevos.nombres) datos.nombres = datosNuevos.nombres;
        if (datosNuevos.apellidos) datos.apellidos = datosNuevos.apellidos;
        if (datosNuevos.dni) datos.dni = datosNuevos.dni;

        // update de direccion //
        if (datosNuevos.direccion) {
            let calle = await Calle.findOne({ codigo : datosNuevos.direccion.calle }).session(session).exec();
            let datos = {
                calle: calle._id,
                numeracion: datosNuevos.direccion.numeracion
            }
            if (datosNuevos.direccion.piso) datos.piso = datosNuevos.direccion.piso;
            if (datosNuevos.direccion.departamento) datos.departamento = datosNuevos.direccion.departamento;
            if (datosNuevos.direccion.barrio) datos.barrio = datosNuevos.direccion.barrio;

            await Domicilio.findOneAndUpdate({ _id: solicitud.direccion._id }, datos).session(session).exec();
        }

        await Solicitud.findOneAndUpdate({ _id: datosNuevos._id }, datos).session(session).exec();        

        await session.commitTransaction();
        session.endSession();

        return await Solicitud.findOne({ _id: datosNuevos._id }).populate(['tipo', 'tracking', 'direccion', {
            path: 'direccion',
            populate: { path: 'calle', model: 'Calle'}
        }]).exec();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
    
}

module.exports = { creaSolicitud, informeSolicitud, busca, actualizaSolicitud }