const express = require("express");
const router = express.Router();
const { verify, webhook } = require('../controllers/paymentController');
const { verifyToken, recruiter_role, model_role } = require("../utils/verify");

router.post('/verify', verify);
router.post('/webhook', webhook);


module.exports = router;