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

module.exports = { crea, informe }