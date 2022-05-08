const express = require('express');
const router = express.Router();
// Middlewares //
const solicitudMidd = require('../middlewares/solicitudMiddleware');
// Controllers //
const solicitudCtrl = require('../controllers/solicitudController');

// Registro de solicitud //
router.post('/', [solicitudMidd.validaCampos, solicitudMidd.validaServicio, solicitudMidd.validaCalle], async (req, res) => await solicitudCtrl.creaSolicitud(req, res));

module.exports = router;