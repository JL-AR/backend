const express = require('express');
const router = express.Router();
// Controllers //
const reclamoCtrl = require('../controllers/reclamoController');
// Middlewares //
const reclamoMidd = require('../middlewares/reclamoMiddleware');
const servicioMidd = require('../middlewares/servicioMiddleware');
const domicilioMidd = require('../middlewares/domicilioMiddleware');

// Registro de reclamo //
router.post('/', [reclamoMidd.validaCampos, servicioMidd.validaServicio, domicilioMidd.validaCalle], async (req, res) => await reclamoCtrl.creaReclamo(req, res));

module.exports = router;