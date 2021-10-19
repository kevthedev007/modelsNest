const express = require('express')
const router = express.Router();
const { createAccount, dashboard, allRecruiters } = require('../controllers/recruiterController')
const { verifyToken, recruiter_role } = require('../utils/verify')

router.post('/account', [verifyToken, recruiter_role], createAccount)
router.get('/dashboard', [verifyToken, recruiter_role], dashboard)






router.get('/allrecruiters', allRecruiters)








module.exports = router