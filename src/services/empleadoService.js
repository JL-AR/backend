// Models //
const Empleado = require('../models/EmpleadoModel');
const Domicilio = require('../models/DomicilioModel');
const Calle = require('../models/CalleModel');

const crea = async (datosEmpleado) => {
    const session = await Empleado.startSession();
    session.startTransaction();
    try {
        let empleado = {
            legajo: datosEmpleado.legajo,
            apellido: datosEmpleado.apellido,
            nombre: datosEmpleado.nombre,
            sector:  datosEmpleado.sector,
            dni: datosEmpleado.dni,
            telefono: datosEmpleado.telefono
        }

        let domicilio = {
            calle: datosEmpleado.domicilio.calle,
            numeracion: datosEmpleado.domicilio.numeracion
        }

        if (datosEmpleado.domicilio.piso) domicilio.piso = datosEmpleado.domicilio.piso;
        if (datosEmpleado.domicilio.departamento) domicilio.departamento = datosEmpleado.domicilio.departamento;
        domicilio = await new Domicilio(domicilio);
        await Domicilio.create([domicilio], {session: session});
        empleado.domicilio = domicilio;

        await Empleado.create([empleado], {session: session});
        
        await session.commitTransaction();
        session.endSession();

        return empleado;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

// Informe general de Empleados, se paginan los datos por pagina y cantidad por pagina mediante param options //
const informe = async (options) => {
    options.populate = ['domicilio', { path: 'domicilio', populate: { path: 'calle', model: 'Calle'}}, 'sector'];
    let result = await Empleado.paginate({}, options);
    await Empleado.populate(result.docs, options.populate);
    return result;
}

const actualiza = async (datosNuevos) => {
    const session = await Empleado.startSession();
    session.startTransaction();
    let datos = {};

    try {
        let populate = ['domicilio', { path: 'domicilio', populate: { path: 'calle', model: 'Calle'}}, 'sector'];
        let empleado = await Empleado.findOne({ _id: datosNuevos._id }).exec();
        if (datosNuevos.legajo) datos.legajo = datosNuevos.legajo;
        if (datosNuevos.apellido) datos.apellido = datosNuevos.apellido;
        if (datosNuevos.nombre) datos.nombre = datosNuevos.nombre;
        if (datosNuevos.sector) datos.sector = datosNuevos.sector;
        if (datosNuevos.dni) datos.dni = datosNuevos.dni;
        if (datosNuevos.telefono) datos.telefono = datosNuevos.telefono;
        if (datosNuevos.domicilio) {
            let datos = {};
            if (datosNuevos.domicilio.calle) {
                let calle = await Calle.findById(datosNuevos.domicilio.calle).session(session).exec();
                datos.calle = calle;
            }
            if (datosNuevos.domicilio.numeracion) datos.numeracion = datosNuevos.domicilio.numeracion;
            if (datosNuevos.domicilio.piso) datos.piso = datosNuevos.direccion.piso;
            if (datosNuevos.domicilio.departamento) datos.departamento = datosNuevos.direccion.departamento;
            //if (datosNuevos.domicilio.barrio) datos.barrio = datosNuevos.direccion.barrio;

            await Domicilio.findOneAndUpdate({ _id: empleado.domicilio._id }, datos).session(session).exec();
        }

        await Empleado.findOneAndUpdate({ _id: datosNuevos._id }, datos).session(session).exec();        

        await session.commitTransaction();
        session.endSession();
        empleado = await Empleado.findOne({ _id: datosNuevos._id }).exec();
        await Empleado.populate([empleado], populate);
        return empleado;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
    
}

// Busqueda por campos //
const busca = async (options) => {
    const session = await Empleado.startSession();
    session.startTransaction();
    let result = {};
    let valoresIngresados = [];
    let valoresABuscar = [];
    let aggregate = {};
    
    try {        
        options.populate = ['domicilio', { path: 'domicilio', populate: { path: 'calle', model: 'Calle'}}, 'sector'];
        // Palabras ingresadas p/ busqueda //
        if (options.campo == 'APELLIDO' || options.campo == 'NOMBRE') {
            valoresIngresados = options.valor.split(" ");
        }
        switch (options.campo) {
            case 'DNI':
                /*aggregate = Empleado.aggregate().addFields({ dniStr: { $toString: "$dni" }});
                aggregate.match({"dniStr": { $regex: String(options.valor) }});                
                result = await Empleado.aggregatePaginate(aggregate, options);                
                await Empleado.populate(result.docs, options.populate);*/
                result = await Empleado.paginate({ dni: options.valor });
                await Empleado.populate(result.docs, options.populate);
                break;
            case 'LEGAJO':
                aggregate = Empleado.aggregate().addFields({ legajoStr: { $toString: "$legajo" }});
                aggregate.match({"legajoStr": { $regex: String(options.valor) }});                
                result = await Empleado.aggregatePaginate(aggregate, options);                
                await Empleado.populate(result.docs, options.populate);
                break;
            case 'TELEFONO':
                /*aggregate = Empleado.aggregate().addFields({ telStr: { $toString: "$telefono" }});
                aggregate.match({"telStr": { $regex: String(options.valor) }});                
                result = await Empleado.aggregatePaginate(aggregate, options);                
                await Empleado.populate(result.docs, options.populate);*/
                result = await Empleado.paginate({ telefono: options.valor });
                await Empleado.populate(result.docs, options.populate);
                break;
            case 'APELLIDO':
                valoresIngresados.forEach( item => {
                    let cod = { apellido: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(cod);
                });
                result = await Empleado.paginate({ $or: valoresABuscar });
                break;
            case 'NOMBRE':
                valoresIngresados.forEach( item => {
                    let nom = { nombre: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(nom);
                });
                result = await Empleado.paginate({ $or: valoresABuscar });
                break;
            case 'DOMICILIO':
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
                // Se obtienen Empleados con domicilios correspondientes //
                result = await Empleado.paginate({ domicilio: { $in: direccionesIds }}, options);
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

module.exports = { crea, informe, actualiza, busca }