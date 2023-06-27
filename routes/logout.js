const express = require('express');
const router = express.Router();
// Controller.
const loginController = require('../controllers/authController');

router.get('/', loginController.handleLogout);


module.exports = router;