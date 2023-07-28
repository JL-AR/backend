const RolUsuario = require('../models/RolUsuarioModel');
// Helper //
const respuestas = require('../helpers/respuestas');

// Valida existencia de roles en array //
const validaExistenciaRoles = async (req, res, next) => {
    for (const id of req.body.roles) {
        try {
            let rol = await RolUsuario.findById(id).exec();
            if (!rol) return respuestas.error400(res, `El id '${ id }' no corresponde a un Rol de usuario`);
        } catch (error) {
            return respuestas.error400(res, `El id '${ id }' no corresponde a un Rol de usuario`);
        }
    }
    next();
}

module.exports = { validaExistenciaRoles }