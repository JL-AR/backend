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

module.exports = { crea }