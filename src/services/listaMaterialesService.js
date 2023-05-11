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

module.exports = { crea, informe }