const router = require('express').Router()

const authController = require('../controllers/authController')

router.get('/login/check', authController.login_check_get)

router.post('/login', authController.login_post)

module.exports = router
