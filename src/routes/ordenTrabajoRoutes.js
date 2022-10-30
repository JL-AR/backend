const express = require('express');
const router = express.Router();
// Controllers //
const ordenTrabajoCtrl = require('../controllers/ordenTrabajoController');

// Registro de OT //
router.post('/',  async (req, res) => await ordenTrabajoCtrl.creaOT(req, res));

module.exports = router;