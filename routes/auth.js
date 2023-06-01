const express = require('express');
const router = express.Router();
// Controller.
const loginController = require('../controllers/authController');

router.route('/').post(loginController.handleLogin);


module.exports = router;