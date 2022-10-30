// Modelos //
const OrdenTrabajo = require('../models/OrdenTrabajoModel');
const Contador = require('../models/ContadorModel');

const creaOT = async () => {
    const session = await OrdenTrabajo.startSession();
    session.startTransaction();

    try {
        
        await Contador.findOneAndUpdate({ codigo: 'SEQ-OT'}, {$inc: { seq: 1} });
        let contador = await Contador.findOne({ codigo: 'SEQ-OT' }).session(session).exec();

        let ordenTrabajo = await new OrdenTrabajo({
            numero: contador.seq
        });
        
        await OrdenTrabajo.create([ordenTrabajo], { session: session });
        
        // await OrdenTrabajo.populate([ordenTrabajo],['datos_catastrales', 'medidor','documentacion', 'materiales_conexion']);
        
        await session.commitTransaction();
        session.endSession();

        return ordenTrabajo;

    } catch(error) {
        await session.abortTransaction();
        session.endSession();
        throw error; 
    }
    
}

module.exports = { creaOT }