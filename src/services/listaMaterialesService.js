// Models //
const ListadoMateriales = require('../models/ListaMaterialesModel');

const crea = async (datosNuevaListaMat) => {
    const session = await ListadoMateriales.startSession();
    session.startTransaction();
    try {
        // Creando listado //
        let listadoMateriales = await new ListadoMateriales({
            codigo: datosNuevaListaMat.codigo,
            descripcion: datosNuevaListaMat.descripcion,
            articulos: datosNuevaListaMat.articulos
        });

        await ListadoMateriales.create([listadoMateriales], {session: session});
        
        await session.commitTransaction();
        session.endSession();

        return listadoMateriales;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

// Informe lista de materiales, se paginan los datos por pagina y cantidad por pagina mediante param options //
const informe = async (options) => {
    return await ListadoMateriales.paginate({}, options);
}

const actualiza = async (datosNuevos) => {
    const session = await ListadoMateriales.startSession();
    session.startTransaction();
    let datos = {};

    try {
        if (datosNuevos.codigo) datos.codigo = datosNuevos.codigo;
        if (datosNuevos.descripcion) datos.descripcion = datosNuevos.descripcion;
        if (datosNuevos.articulos) datos.articulos = datosNuevos.articulos;

        await ListadoMateriales.findOneAndUpdate({ _id: datosNuevos._id }, datos).session(session).exec();        

        await session.commitTransaction();
        session.endSession();
        return await ListadoMateriales.findOne({ _id: datosNuevos._id }).exec();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
    
}

// Busqueda por campos //
const busca = async (options) => {
    const session = await ListadoMateriales.startSession();
    session.startTransaction();
    let result = {};
    let valoresIngresados = [];
    let valoresABuscar = [];
    
    try {        
        // Palabras ingresadas p/ busqueda //
        if (options.campo == 'CODIGO' || options.campo == 'DESCRIPCION') {
            valoresIngresados = options.valor.split(" ");
        }
        switch (options.campo) {
            case 'CODIGO':
                valoresIngresados.forEach( item => {
                    let cod = { codigo: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(cod);
                });
                result = await ListadoMateriales.paginate({ $or: valoresABuscar });
                break;
            case 'DESCRIPCION':
                valoresIngresados.forEach( item => {
                    let desc = { descripcion: { $regex: item.trim(), $options: 'i' }};
                    valoresABuscar.push(desc);
                });
                result = await ListadoMateriales.paginate({ $or: valoresABuscar });
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