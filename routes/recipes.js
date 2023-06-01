const express = require('express');
const router = express.Router();

// Controller.
const recipeController = require('../controllers/recipesController');
const upload = require('../middleware/upload')

router.route('/')
    .get(recipeController.getAllRecipes)
    .post(upload.single('uploadedImage'), recipeController.createRecipe)
    .put(recipeController.updateRecipe)
    .delete(recipeController.deleteRecipe);

router.route('/:id')
    .get(recipeController.getSingleRecipe)

module.exports = router;