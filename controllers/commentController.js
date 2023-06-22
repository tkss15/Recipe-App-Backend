const Comment = require('../models/Comments.js');
const Recipe = require('../models/Recipes.js')

const getRecipeComments = async (req,res) => {
    if(!req.params?.id)
        return res.status(400).json({ "message": 'recipe id required' });
    const comments = await Comment.find({ recipeId: req.params.id }); // returns all found recipes.
    if(!comments)
     return res.status(204).json({'message': 'No Comments'}) 
    res.json(comments);
 }

 const postRecipeComment = async(req,res) => {
    console.log(req.body);
    console.log(req.user);
    if(!req.params?.id)
        return res.status(400).json({ "message": 'recipe id required' });

    const findRecipe = await Recipe.findOne({ _id: req.params.id }).exec();
    if(!req?.body?.comment )
        return res.status(400).json({ "message": 'comment is required' });
    if(!req?.body?.rating)
        return res.status(400).json({ "message": 'rating is required' });
    try {
            const result = await Comment.create({
                author: req.user,
                recipeId: req.params.id,
                comment: req.body.comment,
                rating: req.body.rating
            });

            findRecipe.recipeRating += req.body.rating;
            await findRecipe.save();
            res.status(201).json(result);
    } catch (error) {
        console.log(error);
    }
 }

 module.exports = {
    postRecipeComment,
    getRecipeComments
}