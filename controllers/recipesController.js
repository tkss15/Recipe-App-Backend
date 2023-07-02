const Recipe = require('../models/Recipes');
const Comment = require('../models/Comments');
const ROLES_LIST = require('../config/rolesList');


const getAllRecipes = async (req,res) => {
    try {
        const recipes = await Recipe.find(); // returns all found recipes.
        if(!recipes)
         return res.status(204).json({'message': 'No recipes'}) 
        res.json(recipes);
    } catch (error) {
        res.status(500).json({"message":error.message});
    }
}
const getUserAvarage = async(req,res) => {
    if(!req.user)
        return res.status(404).json({"message":"user is logged out"});
    try {
        const userRecipes = await Recipe.find({author:req.user}); 
        if(!userRecipes)
            return res.status(204).json({avarage:0});
        let countComments = 0;
        let recipeFinalRating = 0;
        for await (const singleRecipe of userRecipes) {
            try {
                recipeFinalRating += singleRecipe.recipeRating;
                const comment =  await Comment.find({recipeId:singleRecipe._id}).count().exec();
                if(comment > 0)
                  countComments += comment
            } catch (error) {
                res.status(500).json({"message":"Server Error Try later"});
            }
        }
        recipeFinalRating = (recipeFinalRating/countComments);
        res.status(200).json({avarage:recipeFinalRating ? recipeFinalRating : 0})
        
    } catch (error) {
        res.status(500).json({"message":error.message});
    }
}
const getUserRecipes = async(req,res) => {
    if(!req.user)
        return res.status(404).json({"message":"user is logged out"});
    let limitRecipes = 0;
    if(req?.params?.userlimit)
        limitRecipes = req.params.userlimit

    try {
        const userRecipes = await Recipe.find({author:req.user}).limit(limitRecipes);
        if(!userRecipes)
            return res.status(204).json({'message': 'No recipes'});
        res.json(userRecipes);
    } catch (error) {
        res.status(500).json({"message":error.message});
    }
}

const getBestRecipes = async(req,res) => {
    try {
        const recipes = await Recipe.find()
        .sort({recipeRating: -1})
        .limit(4);
    
        if(!recipes)
         return res.status(204).json({'message': 'No recipes'}) 
        res.json(recipes);
    } catch (error) {
        res.status(500).json({"message":error.message});
    }
}

const createRecipe = async(req,res) => {
    if(
        !req?.body?.recipename ||
        !req?.body?.recipedescription||
        !req?.body?.recipeingredients||
        !req?.body?.recipedifficulty||
        !req?.body?.recipecallories||
        !req?.body?.recipecatagorys||
        !req?.body?.recipeTime ||
        !req.file
        )
        return res.status(400).json({"message" : "Missing required fields in order to continue."})
    if (isNaN(req.body.recipecallories)) 
        return res.status(400).json({"message" : "Recipe callorias must be number!"})
    try {
        console.log(req.fileName)
        const result = await Recipe.create({
            author: req.user,
            recipeName: req.body.recipename,
            recipeDescription: req.body.recipedescription,
            recipeIngredients: req.body.recipeingredients,
            recipeCategorys: req.body.recipecatagorys,
            recipeDifficulty: req.body.recipedifficulty,
            recipeCallories: req.body.recipecallories,
            recipeTime: req.body.recipeTime,
            Image: req.fileName
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({"message": error.message}); 
    }
}


const updateRecipe = async(req,res) => {
    if(!req?.body?.id)
    {
        return res.status(400).json({"message": "id of recipe is required"})
    }
    try {
            const findRecipe = await Recipe.findOne({ _id: req.body.id }).exec();
            if(!findRecipe)
            {
                return res.status(400).json({"message": `Recipe id ${req.body.id} not found`}); 
            }

            if(findRecipe.author !== req.user)
            {
                return res.status(401).json({"message": `You have no permissions to edit the recipe`}); 
            }

            if(req.body?.recipeName)        findRecipe.recipeName = req.body.recipeName;
            if(req.body?.recipeDescription) findRecipe.recipeDescription = req.body.recipeDescription
            if(req.body?.recipeIngredients) findRecipe.recipeIngredients = req.body.recipeIngredients
            if(req.body?.recipeCategorys)  
                findRecipe.recipeCategorys = req.body.recipeCategorys
            if(req.body?.recipeDifficulty)  findRecipe.recipeDifficulty = req.body.recipeDifficulty
            if(req.body?.recipeTime)   findRecipe.recipeTime = req.body.recipeTime
            if(req.body?.recipeCallories)
            {
                if (isNaN(req.body.recipeCallories)) 
                    return res.status(400).json({"message" : "Recipe callorias must be number!"})
                findRecipe.recipeCallories = req.body.recipeCallories
            } 

        const result = await findRecipe.save();
        res.json(result);
    } catch (error) {
        return res.status(500).json({"message":error.message});
    }
}

const deleteRecipe = async(req,res) => {
    if(!req?.body?.id) 
        return res.status(400).json({'message': "Recipe id required"});

    try {
        const findRecipe = await Recipe.findOne({ _id: req.body.id }).exec();
        if(!findRecipe)
        {
            return res.status(204).json({"message": `Recipe id ${req.body.id} not found`}); 
        }
        if(req.roles.includes(ROLES_LIST.Admin) !== true)
        {
            if(findRecipe.author !== req.user)
            {
                return res.status(401).json({"message": `You have no permissions to delete the recipe`}); 
            }
        }
        const deleteComments = await Comment.deleteMany({recipeId: findRecipe._id});
        const result = await findRecipe.deleteOne();
        res.json(result);
        
    } catch (error) {
        res.status(500).json({"message":error.message});
    }
}

const getSingleRecipe = async (req,res) => {
    if(!req?.params?.id) 
        return res.status(400).json({'message': "Recipe id required"});

    try {
        const findRecipe = await Recipe.findOne({ _id: req.params.id }).exec();
        if(!findRecipe)
        {
            return res.status(204).json({"message": `Recipe id ${req.params.id} not found`}); 
        }
        res.json(findRecipe);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = {
    getAllRecipes,
    getUserAvarage,
    getUserRecipes,
    getBestRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getSingleRecipe
}
