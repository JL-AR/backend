const express = require('express');
const router = express.Router();
// Controllers //
const usuarioCtrl = require('../controllers/usuarioController');
// Middlewares //
const paginadoMidd = require('../middlewares/paginadoMiddleware');
const usuarioMidd = require('../middlewares/usuarioMiddleware');
const rolMidd = require('../middlewares/rolMiddleware');

// Registro de usuario //
router.post('/', [usuarioMidd.validaCamposCrear, usuarioMidd.validaInexistencia, rolMidd.validaExistenciaRoles], async (req, res) => await usuarioCtrl.crea(req, res));
/*/ Informe de empleados //
router.get('/', paginadoMidd.validaCampos, async (req, res) => await empleadoCtrl.informe(req, res));
// Actualiza empleado existente //
router.put('/', [empleadoMidd.validaCamposUpdate, empleadoMidd.validaExistente, domicilioMidd.validaCallePorId, sectorMidd.validaExistencia], async (req, res) => await empleadoCtrl.actualiza(req, res));
// Busqueda por campos //
router.get('/busca', paginadoMidd.verificaDatosBusqueda, async (req, res) => await empleadoCtrl.busca(req, res));*/

module.exports = router;