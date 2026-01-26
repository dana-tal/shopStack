const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/placeOrder', orderController.placeOrder);
router.get('/:userId', orderController.getUserOrders);

module.exports = router;

