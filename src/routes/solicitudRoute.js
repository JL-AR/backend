const express = require('express');
const router = express.Router();
// Middlewares //
const solicitudMidd = require('../middlewares/solicitudMiddleware');
const servicioMidd = require('../middlewares/servicioMiddleware');
const domicilioMidd = require('../middlewares/domicilioMiddleware');
const paginadoMidd = require('../middlewares/paginadoMiddleware');
// Controllers //
const solicitudCtrl = require('../controllers/solicitudController');

// Registro de solicitud //
router.post('/', [solicitudMidd.validaCampos, servicioMidd.validaServicio, domicilioMidd.validaCalle], async (req, res) => await solicitudCtrl.creaSolicitud(req, res));
// Informe de solicitud //
router.get('/', paginadoMidd.validaCampos, async (req, res) => await solicitudCtrl.informeSolicitud(req, res));
// Busqueda por proximidad //
router.get('/busca', paginadoMidd.validaCampos, async (req, res) => await solicitudCtrl.busca(req, res));

module.exports = router;