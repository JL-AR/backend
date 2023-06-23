const express = require('express');
const router = express.Router();
// Controllers //
const empleadoCtrl = require('../controllers/empleadoController');
// Middlewares //
const paginadoMidd = require('../middlewares/paginadoMiddleware');

// Registro de empleado //
router.post('/', /*[articuloMidd.validaCamposCrear, articuloMidd.validaInexistencia],*/ async (req, res) => await empleadoCtrl.crea(req, res));
/*/ Informe de articulos //
router.get('/', paginadoMidd.validaCampos, async (req, res) => await articuloCtrl.informe(req, res));
// Actualiza articulo existente //
router.put('/', [articuloMidd.validaCamposUpdate, articuloMidd.validaExistente], async (req, res) => await articuloCtrl.actualiza(req, res));
// Busqueda por campos //
router.get('/busca', paginadoMidd.verificaDatosBusqueda, async (req, res) => await articuloCtrl.busca(req, res));*/

module.exports = router;