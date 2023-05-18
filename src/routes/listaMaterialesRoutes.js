const express = require('express');
const router = express.Router();
// Controllers //
const listaMaterialesCtrl = require('../controllers/listaMaterialesController');
// Middlewares //
const listadoMidd = require('../middlewares/listaMaterialesMiddleware');
const paginadoMidd = require('../middlewares/paginadoMiddleware');

// Registro de lista de materiales //
router.post('/', [listadoMidd.validaCamposCrear, listadoMidd.validaInexistencia, listadoMidd.validaExistenciaArticulos], async (req, res) => await listaMaterialesCtrl.crea(req, res));
// Informe de lista de materiales //
router.get('/', paginadoMidd.validaCampos, async (req, res) => await listaMaterialesCtrl.informe(req, res));
// Actualiza lista de materiales existente //
router.put('/', /*[articuloMidd.validaCamposUpdate, articuloMidd.validaExistente],*/ async (req, res) => await listaMaterialesCtrl.actualiza(req, res));
// Busqueda por campos //
/*router.get('/busca', paginadoMidd.verificaDatosBusqueda, async (req, res) => await articuloCtrl.busca(req, res));*/

module.exports = router;