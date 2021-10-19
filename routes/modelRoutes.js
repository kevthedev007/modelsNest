const express = require('express')
const router = express.Router();
const { createAccount, dashboard } = require('../controllers/modelController')
const { verifyToken, model_role } = require('../utils/verify')

router.post('/account', [verifyToken, model_role], createAccount)
router.get('/dashboard', [verifyToken, model_role], dashboard)



module.exports = router