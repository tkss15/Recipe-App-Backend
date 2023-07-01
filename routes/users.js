const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

router.route('/').get(usersController.getUserJWT)
                 .put(usersController.updateUser);

router.route('/handle')
.get(verifyRoles(ROLES_LIST.Admin),usersController.getAllUsers)
.put(verifyRoles(ROLES_LIST.Admin), usersController.editRolesUser)
.delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id').get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);


module.exports = router;