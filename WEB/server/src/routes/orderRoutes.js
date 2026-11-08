const express = require('express');
const router = express.Router();
const c = require('../controllers/orderController');

router.get('/', c.getAllOrders);
router.get('/:id', c.getOrderById);
router.post('/', c.createOrder);
router.patch('/:id/status', c.updateOrderStatus);
router.delete('/:id', c.deleteOrder);

module.exports = router;
