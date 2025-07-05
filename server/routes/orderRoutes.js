const express = require('express');
const { placeOrder } = require('../controllers/orderController');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const router = express.Router();

router.post('/place-order', ClerkExpressWithAuth(), placeOrder);

module.exports = router;
