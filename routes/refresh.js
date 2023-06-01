const express = require('express');
const router = express.Router();
// Controller.
const loginController = require('../controllers/authController');

router.route('/').get(loginController.handleRefresh) 


module.exports = router;