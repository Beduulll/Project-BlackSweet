const express = require('express');
const router = express.Router();
const c = require('../controllers/serviceController');

router.get('/', c.getAllServices);
router.get('/:id', c.getServiceById);
router.post('/', c.createService);
router.put('/:id', c.updateService);
router.delete('/:id', c.deleteService);

module.exports = router;
