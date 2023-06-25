const express = require('express');
const router = express.Router();
// Controllers //
const empleadoCtrl = require('../controllers/empleadoController');
// Middlewares //
const paginadoMidd = require('../middlewares/paginadoMiddleware');
const empleadoMidd = require('../middlewares/empleadoMiddleware');
const domicilioMidd = require('../middlewares/domicilioMiddleware');
const sectorMidd = require('../middlewares/sectorMiddleware');

// Registro de empleado //
router.post('/', [empleadoMidd.validaCamposCrear, empleadoMidd.validaInexistencia, domicilioMidd.validaCallePorId, sectorMidd.validaExistencia], async (req, res) => await empleadoCtrl.crea(req, res));
// Informe de empleados //
router.get('/', paginadoMidd.validaCampos, async (req, res) => await empleadoCtrl.informe(req, res));
/*/ Actualiza articulo existente //
router.put('/', [articuloMidd.validaCamposUpdate, articuloMidd.validaExistente], async (req, res) => await articuloCtrl.actualiza(req, res));
// Busqueda por campos //
router.get('/busca', paginadoMidd.verificaDatosBusqueda, async (req, res) => await articuloCtrl.busca(req, res));*/

module.exports = router;