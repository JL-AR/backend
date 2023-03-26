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

const actualizaReclamo = async (datosNuevos) => {
    const session = await Reclamo.startSession();
    session.startTransaction();
    let datos = {};

    try {

        let reclamo = await Reclamo.findOne({ _id: datosNuevos._id }).session(session).exec();
        // update p/ tipo de servicio //
        if (datosNuevos.servicio) {
            let servicio = await Servicio.findOne({ codigo: datosNuevos.servicio }).session(session).exec();
            datos.servicio = servicio._id;
        }

        // update de tracking (se agrega movimiento) y estado (se actualiza) //
        if (datosNuevos.ultimo_estado) {
            let estado = await Estado.findOne({ codigo: datosNuevos.ultimo_estado.estado }).session(session).exec();
            let datosMov = {
                estado: estado._id
            }
            if (datosNuevos.ultimo_estado.observacion) datosMov.observacion = datosNuevos.ultimo_estado.observacion;
            let movimiento = await new Movimiento(datosMov);
            

            await Movimiento.create([movimiento], { session: session });

            reclamo.tracking.push(movimiento._id);
            reclamo.ultimo_estado = estado;
            await reclamo.save(session);
        }

        // update de nombre, observaciones e email //
        if (datosNuevos.nombre) datos.nombre = datosNuevos.nombre;
        if (datosNuevos.observaciones) datos.observaciones = datosNuevos.observaciones;
        if (datosNuevos.email) datos.email = datosNuevos.email;

        // update de direccion //
        if (datosNuevos.domicilio) {
            let calle = await Calle.findOne({ codigo : datosNuevos.domicilio.calle }).session(session).exec();
            let datos = {
                calle: calle._id
            }
            if (datosNuevos.domicilio.numeracion) datos.numeracion = datosNuevos.domicilio.numeracion;
            if (datosNuevos.domicilio.barrio) datos.barrio = datosNuevos.domicilio.barrio;

            await Domicilio.findOneAndUpdate({ _id: reclamo.domicilio._id }, datos).session(session).exec();
        }

        await Reclamo.findOneAndUpdate({ _id: datosNuevos._id }, datos).session(session).exec();        

        await session.commitTransaction();
        session.endSession();
        let populate = ['servicio', 'ultimo_estado', 'tracking', 'domicilio', { path: 'domicilio', populate: { path: 'calle', model: 'Calle'}}];
        return await Reclamo.findOne({ _id: datosNuevos._id }).populate(populate).exec();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
    
}

// Busqueda por campos //
const busca = async (options) => {
    options.populate = ['domicilio', 'servicio', 'tracking', { path: 'tracking', populate: { path: 'estado', model: 'Estado' }},
        { path: 'domicilio', populate: { path: 'calle', model: 'Calle'}}, 'ultimo_estado' ];

    const session = await Reclamo.startSession();
    session.startTransaction();
    let result = {};
    let aggregate = {};
    let valoresIngresados = "";
    let valoresABuscar = [];
    
    try {        
        switch (options.campo) {
            case 'SERVICIO':
                let servicio = await Servicio.findOne({ codigo: options.valor }).session(session).exec();
                options.valor = servicio;
                result = await Reclamo.paginate({ 'servicio': options.valor }, options);
                break;
            case 'DOMICILIO':
                // Palabras ingresadas p/ busqueda //
                valoresIngresados = options.valor.split(" ");
                // Busca coincidencia en calles //
                valoresIngresados.forEach( item => {
                    valoresABuscar.push({ nombre: { $regex: item.trim(), $options: 'i' }});
                });                
                let calles = await Calle.find({ $or: valoresABuscar }).session(session).exec();                
                // Si se encuentran coincidencias se obtienes los ids de las calles //
                let callesIds = [];
                if (calles) calles.forEach(item => callesIds.push(item._id));

                // Se preparan los datos a buscar //
                let datosABuscar = [];
                if (callesIds.length) datosABuscar.push({ calle: { $in: callesIds }});
                valoresIngresados.forEach(item => datosABuscar.push({ numeracion: { $regex: item.trim(), $options: 'i' }}));
                // Se obtienen Domicilios coincidentes //
                let direcciones = await Domicilio.find({ $or: datosABuscar }).session(session).exec();
                direccionesIds = [];
                direcciones.forEach(item => direccionesIds.push(item._id));
                // Se obtienen Solicitudes de domicilios correspondientes //
                result = await Reclamo.paginate({ domicilio: { $in: direccionesIds }}, options);
                break;
            case 'NOMBRE':
                valoresIngresados = options.valor.split(" ");
                valoresIngresados.forEach( item => {
                    let nom = { nombre: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(nom);
                });

                result = await Reclamo.paginate({ $or: valoresABuscar }, options);
                break;
            case 'RANGO_FECHAS':
                result = await Reclamo.paginate({ fecha_alta: { $gte: new Date(options.inicio), $lte: new Date(options.fin) }}, options);
                break;
            case 'ESTADO':
                let estado = await Estado.findOne({ codigo: options.valor }).session(session).exec();
                result = await Reclamo.paginate({ 'ultimo_estado': estado._id }, options);
                break;
            case 'CRITICIDAD':
                let servicios = await Servicio.find({ criticidad: options.valor }).session(session).exec();
                result = await Reclamo.paginate({ 'servicio': servicios }, options);
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

module.exports = { creaReclamo, informeReclamo, actualizaReclamo, busca }