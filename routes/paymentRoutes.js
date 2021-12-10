const express = require("express");
const router = express.Router();
const { verify, webhook } = require('../controllers/paymentController');
const { verifyToken, recruiter_role, model_role } = require("../utils/verify");

router.get('/verify', verify);
router.post('/verify', webhook);


module.exports = router;