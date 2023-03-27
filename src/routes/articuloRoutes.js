const express = require('express');
const router = express.Router();
// Controllers //
const articuloCtrl = require('../controllers/articuloController');
// Middlewares //
const articuloMidd = require('../middlewares/articuloMiddleware');
const paginadoMidd = require('../middlewares/paginadoMiddleware');

// Registro de articulo //
router.post('/', [articuloMidd.validaCamposCrear, articuloMidd.validaInexistencia], async (req, res) => await articuloCtrl.crea(req, res));
// Informe de articulos //
router.get('/', paginadoMidd.validaCampos, async (req, res) => await articuloCtrl.informe(req, res));
// Actualiza articulo existente //
router.put('/', [articuloMidd.validaCamposUpdate, articuloMidd.validaExistente], async (req, res) => await articuloCtrl.actualiza(req, res));
// Busqueda por campos //
router.get('/busca', /*[reclamoMidd.verificaDatosBusqueda, paginadoMidd.validaCampos],*/ async (req, res) => await articuloCtrl.busca(req, res));

module.exports = router;