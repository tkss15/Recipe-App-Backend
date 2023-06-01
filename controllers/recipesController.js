const Recipe = require('../models/Recipes');

const getAllRecipes = async (req,res) => {
   const recipes = await Recipe.find(); // returns all found recipes.
   if(!recipes)
    return res.status(204).json({'message': 'No recipes'}) 
   res.json(recipes);
}

const createRecipe = async(req,res) => {
    console.log(req.file);
    if(!req.file)
        return res.status(400).json({"message" : "Missing required fields in order to continue2"})
    if(
        !req?.body?.author ||  
        !req?.body?.recipename ||
        !req?.body?.recipedescription||
        !req?.body?.recipeingredients||
        !req?.body?.recipedifficulty||
        !req?.body?.recipecallories||
        !req?.body?.recipecatagorys||
        !req?.body?.recipeTime 
        )
        return res.status(400).json({"message" : "Missing required fields in order to continue"})
    const {path:image} = req.file;
    try {
        const result = await Recipe.create({
             author: req.body.author,
            recipeName: req.body.recipename,
            recipeDescription: req.body.recipedescription,
            recipeIngredients: req.body.recipeingredients,
            recipeCategorys: req.body.recipecatagorys,
            recipeDifficulty: req.body.recipedifficulty,
            recipeCallories: req.body.recipecallories,
            recipeTime: req.body.recipeTime,
            Image: image.replace('\\', "/")
        });
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
    }
}

const updateRecipe = async(req,res) => {
    if(!req?.body?.id)
    {
        return res.status(400).json({"message": "id of recipe is required"})
    }

    const findRecipe = await Recipe.findOne({ _id: req.body.id }).exec();
    if(!findRecipe)
    {
        return res.status(204).json({"message": `Recipe id ${req.body.id} not found`}); 
    }

    if(req.body?.recipeName)        findRecipe.recipeName = req.body.recipeName;
    if(req.body?.recipeDescription) findRecipe.recipeDescription = req.body.recipeDescription
    if(req.body?.recipeIngredients) findRecipe.recipeIngredients = req.body.recipeIngredients
    if(req.body?.recipeCategorys)   findRecipe.recipeTime = req.body.recipeCategorys
    if(req.body?.recipeDifficulty)  findRecipe.recipeDifficulty = req.body.recipeDifficulty
    if(req.body?.recipeTime)   findRecipe.recipeTime = req.body.recipeTime
    if(req.body?.recipeCallories)   findRecipe.recipeCallories = req.body.recipeCallories

    const result = await findRecipe.save();
    res.json(result);
}

const deleteRecipe = async(req,res) => {
    if(!req?.body?.id) 
        return res.status(400).json({'message': "Recipe id required"});

    const findRecipe = await Recipe.findOne({ _id: req.body.id }).exec();
    if(!findRecipe)
    {
        return res.status(204).json({"message": `Recipe id ${req.body.id} not found`}); 
    }
    const result = await findRecipe.deleteOne();
    res.json(result);
}

const getSingleRecipe = async (req,res) => {
    if(!req?.params?.id) 
        return res.status(400).json({'message': "Recipe id required"});

    const findRecipe = await Recipe.findOne({ _id: req.params.id }).exec();
    if(!findRecipe)
    {
        return res.status(204).json({"message": `Recipe id ${req.params.id} not found`}); 
    }
    res.json(findRecipe);
}

module.exports = {
    getAllRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getSingleRecipe
}