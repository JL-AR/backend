// Modelos //
const Solicitud = require('../models/SolicitudModel');
const Contador = require('../models/ContadorModel');
const Servicio = require('../models/ServicioModel');
const Domicilio = require('../models/DomicilioModel');
const Calle = require('../models/CalleModel');
const Estado = require('../models/EstadoModel');
const Movimiento = require('../models/MovimientoModel');
const OrdenTrabajo = require('../models/OrdenTrabajoModel');
// Services //
const ordenTrabajoService = require('./ordenTrabajoService');

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
            ultimo_estado: estado._id,
            nombres: datosSolicitud.nombres,
            apellidos: datosSolicitud.apellidos,
            dni: datosSolicitud.dni,
            direccion: domicilio._id,
            email: datosSolicitud.email
        });
        
        await Solicitud.create([solicitud], { session: session });
        
        await Solicitud.populate([solicitud],['tipo', 'tracking', 'ultimo_estado', 'ordenTrabajo', 'direccion']);
        
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
    options.populate = ['direccion', 'tipo', 'tracking', { path: 'tracking', populate: { path: 'estado', model: 'Estado' }},
        { path: 'direccion', populate: { path: 'calle', model: 'Calle'}}, 'ultimo_estado', 'orden_trabajo'];
    return await Solicitud.paginate({}, options);
}

// Busqueda por campos //
const busca = async (options) => {
    options.populate = ['direccion', 'tipo', 'tracking', { path: 'tracking', populate: { path: 'estado', model: 'Estado' }},
        { path: 'direccion', populate: { path: 'calle', model: 'Calle'}}, 'ultimo_estado', 'orden_trabajo'];

    const session = await Solicitud.startSession();
    session.startTransaction();
    let result = {};
    let aggregate = {};
    
    try {        
        switch (options.campo) {
            case 'TIPO_SOLICITUD':
                let servicio = await Servicio.findOne({ codigo: options.valor }).session(session).exec();
                options.valor = servicio;
                result = await Solicitud.paginate({ 'tipo': options.valor }, options);
                break;
            case 'APELLIDO_NOMBRE':
                let valoresIngresados = options.valor.split(" ");
                let valoresABuscar = [];
                valoresIngresados.forEach( item => {
                    let nom = { nombres: { $regex: item.trim(), $options: 'i' }};
                    let ape = { apellidos: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(nom, ape);
                });

                result = await Solicitud.paginate({ $or: valoresABuscar }, options);
                break;
            case 'DNI':
                aggregate = Solicitud.aggregate().addFields({ dniStr: { $toString: "$dni" }});
                aggregate.match({"dniStr": { $regex: String(options.valor) }});                
                result = await Solicitud.aggregatePaginate(aggregate, options);                
                await Solicitud.populate(result.docs, options.populate);
                break;
            case 'NUMERO':
                aggregate = Solicitud.aggregate().addFields({ numStr: { $toString: "$numero" }});
                aggregate.match({"numStr": { $regex: String(options.valor) }});                
                result = await Solicitud.aggregatePaginate(aggregate, options);
                await Solicitud.populate(result.docs, options.populate);
                break;
            case 'DIRECCION':
                // Palabras ingresadas p/ busqueda //
                let valIngresados = options.valor.split(" ");
                // Busca coincidencia en calles //
                let valABuscarCalle = [];
                valIngresados.forEach( item => {
                    valABuscarCalle.push({ nombre: { $regex: item.trim(), $options: 'i' }});
                });                
                let calles = await Calle.find({ $or: valABuscarCalle }).session(session).exec();                
                // Si se encuentran coincidencias se obtienes los ids de las calles //
                let callesIds = [];
                if (calles) calles.forEach(item => callesIds.push(item._id));

                // Se preparan los datos a buscar //
                let datosABuscar = [];
                if (callesIds.length) datosABuscar.push({ calle: { $in: callesIds }});
                valIngresados.forEach(item => datosABuscar.push({ numeracion: { $regex: item.trim(), $options: 'i' }}));
                // Se obtienen Domicilios coincidentes //
                let direcciones = await Domicilio.find({ $or: datosABuscar }).session(session).exec();
                direccionesIds = [];
                direcciones.forEach(item => direccionesIds.push(item._id));
                // Se obtienen Solicitudes de domicilios correspondientes //
                result = await Solicitud.paginate({ direccion: { $in: direccionesIds }}, options);
                break;
            case 'RANGO_FECHAS':
                result = await Solicitud.paginate({ fecha_alta: { $gte: new Date(options.inicio), $lte: new Date(options.fin) }}, options);
                break;
            case 'ESTADO':
                let estado = await Estado.findOne({ codigo: options.valor }).session(session).exec();
                result = await Solicitud.paginate({ 'ultimo_estado': estado._id }, options);
                break;
            case 'OT':
                let OT = await OrdenTrabajo.findOne({ numero: options.valor }).session(session).exec();
                result = await Solicitud.paginate({ 'orden_trabajo': OT._id }, options);
                break;
            default:
                break;
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

    await session.commitTransaction();
    await session.endSession();

   
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

        // update de tracking (se agrega movimiento) y estado (se actualiza) //
        if (datosNuevos.ultimo_estado) {
            let estado = await Estado.findOne({ codigo: datosNuevos.ultimo_estado.estado }).session(session).exec();
            let movimiento = await new Movimiento({
                estado: estado._id,
                descripcion: datosNuevos.ultimo_estado.descripcion
            });

            await Movimiento.create([movimiento], { session: session });

            solicitud.tracking.push(movimiento._id);
            solicitud.ultimo_estado = estado;
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

        if (!solicitud.orden_trabajo && datosNuevos.documentacion || datosNuevos.ultimo_estado == 'APROBADO') {
            datos.documentacion = 'true';
            let ordenTrabajo = await ordenTrabajoService.creaOT();
            datos.orden_trabajo = ordenTrabajo._id;
        }

        await Solicitud.findOneAndUpdate({ _id: datosNuevos._id }, datos).session(session).exec();        

        await session.commitTransaction();
        session.endSession();
        let populate = ['tipo', 'tracking', 'direccion', { path: 'direccion', populate: { path: 'calle', model: 'Calle'}}, 'ultimo_estado', 'orden_trabajo'];
        return await Solicitud.findOne({ _id: datosNuevos._id }).populate(populate).exec();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
    
}

module.exports = { creaSolicitud, informeSolicitud, busca, actualizaSolicitud }