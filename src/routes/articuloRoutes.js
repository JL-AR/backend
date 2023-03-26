const express = require('express');
const router = express.Router();
// Controllers //
const articuloCtrl = require('../controllers/articuloController');
// Middlewares //
const articuloMidd = require('../middlewares/articuloMiddleware');

// Registro de articulo //
router.post('/', [articuloMidd.validaCamposCrear, articuloMidd.validaInexistencia], async (req, res) => await articuloCtrl.crea(req, res));

module.exports = router;