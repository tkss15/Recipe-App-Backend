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

 const updateComment = async(req,res) => {
    if(!req?.params?.id)
    {
        return res.status(400).json({"message": "id of comment is required"})
    }

    const findComment = await Comment.findOne({ _id: req.params.id }).exec();
    if(!findComment)
    {
        return res.status(400).json({"message": `Comment id ${req.params.id} not found`}); 
    }
    if(findComment.author !== req.user)
    {
        return res.status(401).json({"message": `You have no permissions to edit the recipe`}); 
    }
    const findRecipe = await Recipe.findOne({_id: findComment.recipeId}).exec();
    findRecipe.recipeRating += (findComment.comment - req.body.data?.comment);
    if(req.body?.data?.comment)       findComment.comment = req.body.data?.comment;
    if(req.body?.data?.rating)        findComment.rating = req.body.data?.rating;

    const result = await findComment.save();
    res.json(result);
}

const deleteComment = async(req,res) => {
    if(!req?.params?.id) 
        return res.status(400).json({'message': "Comment id required"});

    const findComment = await Comment.findOne({ _id: req.params.id }).exec();
    if(!findComment) 
    {
        return res.status(204).json({"message": `Comment id ${req.params.id} not found`}); 
    }
    if(findComment.author !== req.user)
    {
        return res.status(401).json({"message": `You have no permissions to delete the comment`}); 
    }
    const findRecipe = await Recipe.findOne({_id: findComment.recipeId}).exec();
    findRecipe.recipeComments -= 1;
    findRecipe.recipeRating -= findComment.rating;
    await findRecipe.save();

    console.log(findComment);
    const result = await findComment.deleteOne();
    res.json(result);
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
            findRecipe.recipeComments += 1;
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
    getRecipeComments,
    updateComment,
    deleteComment
}