// Models //
const Empleado = require('../models/EmpleadoModel');
const Domicilio = require('../models/DomicilioModel');

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

// Informe general de Articulos, se paginan los datos por pagina y cantidad por pagina mediante param options //
/*const informe = async (options) => {
    return await Articulo.paginate({}, options);
}

const actualiza = async (datosNuevos) => {
    const session = await Articulo.startSession();
    session.startTransaction();
    let datos = {};

    try {
        if (datosNuevos.codigo) datos.codigo = datosNuevos.codigo;
        if (datosNuevos.nombre) datos.nombre = datosNuevos.nombre;
        if (datosNuevos.descripcion) datos.descripcion = datosNuevos.descripcion;
        if (datosNuevos.stock) datos.stock = datosNuevos.stock;
        if (datosNuevos.alerta) datos.alerta = datosNuevos.alerta;

        await Articulo.findOneAndUpdate({ _id: datosNuevos._id }, datos).session(session).exec();        

        await session.commitTransaction();
        session.endSession();
        return await Articulo.findOne({ _id: datosNuevos._id }).exec();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
    
}

// Busqueda por campos //
const busca = async (options) => {
    const session = await Articulo.startSession();
    session.startTransaction();
    let result = {};
    let valoresIngresados = [];
    let valoresABuscar = [];
    
    try {        
        // Palabras ingresadas p/ busqueda //
        if (options.campo == 'CODIGO' || options.campo == 'NOMBRE' || options.campo == 'DESCRIPCION') {
            valoresIngresados = options.valor.split(" ");
        }
        switch (options.campo) {
            case 'CODIGO':
                valoresIngresados.forEach( item => {
                    let cod = { codigo: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(cod);
                });
                result = await Articulo.paginate({ $or: valoresABuscar });
                break;
            case 'NOMBRE':
                valoresIngresados.forEach( item => {
                    let nom = { nombre: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(nom);
                });
                result = await Articulo.paginate({ $or: valoresABuscar });
                break;
            case 'DESCRIPCION':
                valoresIngresados.forEach( item => {
                    let desc = { descripcion: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(desc);
                });
                result = await Articulo.paginate({ $or: valoresABuscar });
                break;
            case 'STOCK':
                result = await Articulo.paginate({ stock: options.valor });
                break;
            case 'ALERTA':
                result = await Articulo.paginate({ alerta: options.valor });
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
}*/

module.exports = { crea/*, informe, actualiza, busca*/ }