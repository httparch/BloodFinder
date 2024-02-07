const express = require('express');
// const register = require('../register');
// const login = require('./login');
// const logout = require('./logout');

const  authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register)
router.post('/login', authController.login)


// router.get('/logout', authController.logout)

module.exports = router;