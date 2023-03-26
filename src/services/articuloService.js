// Models //
const Articulo = require('../models/ArticuloModel');

const crea = async (datosArticulo) => {
    const session = await Articulo.startSession();
    session.startTransaction();
    try {
        // Creando articulo //
        let articulo = {
            codigo: datosArticulo.codigo,
            nombre: datosArticulo.nombre,
            descripcion: datosArticulo.descripcion,
            stock: datosArticulo.stock,
            alerta: datosArticulo.alerta
        }

        await Articulo.create([articulo], {session: session});
        
        await session.commitTransaction();
        session.endSession();

        return articulo;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

// Informe general de Articulos, se paginan los datos por pagina y cantidad por pagina mediante param options //
const informe = async (options) => {
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

module.exports = { crea, informe, actualiza }