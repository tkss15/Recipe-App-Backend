const express = require('express');
const router = express.Router();

const verifyJWT = require('../middleware/verfiyJWT')
// Controller.
const recipeController = require('../controllers/recipesController');
const upload = require('../middleware/upload')

router.route('/')
    .get(recipeController.getAllRecipes)
    .post(upload.single('uploadedImage'), verifyJWT, recipeController.createRecipe)
    .put(verifyJWT,recipeController.updateRecipe)
    .delete(verifyJWT,recipeController.deleteRecipe);

router.route('/top')
    .get(recipeController.getBestRecipes);
router.route('/search/:userlimit?')
        .get(verifyJWT,recipeController.getUserRecipes);
router.route('/avarage')
        .get(verifyJWT, recipeController.getUserAvarage);
router.route('/:id')
    .get(recipeController.getSingleRecipe);


module.exports = router; 