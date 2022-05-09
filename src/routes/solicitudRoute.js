const express = require('express');
const router = express.Router();
// Middlewares //
const solicitudMidd = require('../middlewares/solicitudMiddleware');
const servicioMidd = require('../middlewares/servicioMiddleware');
const domicilioMidd = require('../middlewares/domicilioMiddleware');
// Controllers //
const solicitudCtrl = require('../controllers/solicitudController');

// Registro de solicitud //
router.post('/', [solicitudMidd.validaCampos, servicioMidd.validaServicio, domicilioMidd.validaCalle], async (req, res) => await solicitudCtrl.creaSolicitud(req, res));

module.exports = router;