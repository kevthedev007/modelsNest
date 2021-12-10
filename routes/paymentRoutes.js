const express = require("express");
const router = express.Router();
const { verify } = require('../controllers/paymentController');
const { verifyToken, recruiter_role, model_role } = require("../utils/verify");

router.get('/verify', verify);


module.exports = router;