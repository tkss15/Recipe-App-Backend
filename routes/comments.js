const express = require('express');
const router = express.Router();

const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');
const verifyJWT = require('../middleware/verfiyJWT')

// Controller.
const commentsController = require('../controllers/commentController');

router.route('/')
    .get(verifyJWT, commentsController.getUserComments)
router.route('/admin/:id')
    .get(verifyJWT,verifyRoles(ROLES_LIST.Admin), commentsController.getUserAllComments)    

router.route('/:id')
    .get(commentsController.getRecipeComments)
    .post(verifyJWT, commentsController.postRecipeComment)
    .delete(verifyJWT, commentsController.deleteComment)
    .put(verifyJWT, commentsController.updateComment)

module.exports = router; 