const express = require('express');
const router = express.Router();

const verifyJWT = require('../middleware/verfiyJWT')
// Controller.
const commentsController = require('../controllers/commentController');

router.route('/')
    .get(verifyJWT, commentsController.getUserComments)

router.route('/:id')
    .get(commentsController.getRecipeComments)
    .post(verifyJWT, commentsController.postRecipeComment)

module.exports = router; 