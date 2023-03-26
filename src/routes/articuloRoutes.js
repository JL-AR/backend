const express = require('express');
const router = express.Router();
// Controllers //
const articuloCtrl = require('../controllers/articuloController');

// Registro de articulo //
router.post('/', /*[reclamoMidd.validaCampos, servicioMidd.validaServicio, domicilioMidd.validaCalle],*/ async (req, res) => await articuloCtrl.crea(req, res));

module.exports = router;