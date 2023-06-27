const Comment = require('../models/Comments.js');
const Recipe = require('../models/Recipes.js')

const getUserComments = async(req,res) => { 
    const comments = await Comment.find({author: req.user}).sort({createdAt: -1}).limit(3).exec();

    if(!comments)
        return res.status(204).json({"message": "No comments"});
    
    let commentsRecipes = [];
    await Promise.all(comments.map( async(comment) => {
            const recipe =  await Recipe.find({_id:comment.recipeId});
            commentsRecipes.push({comment, recipe:{...recipe}});
    }));
    res.json(commentsRecipes);
}


const getRecipeComments = async (req,res) => {
    if(!req.params?.id)
        return res.status(400).json({ "message": 'recipe id required' });
    const comments = await Comment.find({ recipeId: req.params.id }).exec(); // returns all found recipes.
    if(!comments)
     return res.status(204).json({'message': 'No Comments'}) 
    res.json(comments);
 }

 const postRecipeComment = async(req,res) => {
    if(!req.params?.id)
        return res.status(400).json({ "message": 'recipe id required' });

    const findRecipe = await Recipe.findOne({ _id: req.params.id }).exec();
    if(!req?.body?.comment )
        return res.status(400).json({ "message": 'comment is required' });
    if(!req?.body?.rating)
        return res.status(400).json({ "message": 'rating is required' });
    if(req.user === findRecipe.author)
        return res.status(403).json({"message": "Author cannot comment on his recipe"})
    try 
    {
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
        res.status(500).json({"message":"Server Error"})
    }
 }

 module.exports = {
    postRecipeComment,
    getUserComments,
    getRecipeComments
}