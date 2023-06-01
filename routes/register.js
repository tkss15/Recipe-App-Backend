const express = require('express');
const router = express.Router();
// Controller.
const registerController = require('../controllers/registerController');


router.route('/').post(registerController.registerUser)

module.exports = router;