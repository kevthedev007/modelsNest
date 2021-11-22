const express = require("express");
const router = express.Router();
const { BookPayment, subscriptionPayment, verify } = require('../controllers/paymentController');
const { verifyToken, recruiter_role, model_role } = require("../utils/verify");


router.post('/bookmodel', verifyToken, BookPayment);
router.post('/subscription', verifyToken, subscriptionPayment);
router.get('/verify', verify);


module.exports = router;