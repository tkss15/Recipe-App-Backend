const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verfiyJWT')


//router.route('/').get(usersController.getAllUsers);
router.route('/').get(verifyJWT, usersController.getUserJWT);
router.route('/:id').get(usersController.getUser);


module.exports = router;