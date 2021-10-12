const express = require('express')
const router = express.Router()
const { register, confirmation, signin, forget_password, reset_password, google_signup } = require('../controllers/authController')

router.post('/register', register)
router.post('/signin', signin)
router.get('/confirmation/:token', confirmation)
router.post('/forget-password', forget_password)
router.post('/reset-password', reset_password)
router.post('/google-auth', google_signup)






module.exports = router
