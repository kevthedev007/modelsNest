const express = require("express");
const router = express.Router();
const { verify, webhook, bookModel, subscription } = require('../controllers/paymentController');
const { verifyToken, recruiter_role, model_role } = require("../utils/verify");

router.get('/book-model', verifyToken, bookModel);
router.get('/subscription', verifyToken, subscription);
router.get('/verify', verify);
router.post('/webhook', webhook);


module.exports = router;