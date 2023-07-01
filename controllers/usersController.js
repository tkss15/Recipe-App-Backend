const User = require('../models/Users');
const Recipe = require('../models/Recipes');
const Comment = require('../models/Comments');

const getAllUsers = async(req,res) => {
    const users = await User.find();
    if(!users)
        return res.status(204).json({"message":"No users found"});
    res.json(users);
}

const deleteUser = async(req,res) => {
    if(!req?.body?.id)
        return res.status(400).json({"message":"User ID required"});
    const user = await User.findOne({_id: req.body.id}).exec();
    if(!user)
    {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    try {
        const deleteComments = await Comment.deleteMany({author: user.username});
        const userRecipes = await Recipe.find({author: user.username});
        
        await Promise.all(userRecipes.map( async(recipe) => {
            const deleteRecipeComments =  await Comment.deleteMany({recipeId:recipe._id});
        }));
        const result = await Recipe.deleteMany({author: user.username});
        res.json(result);
    } catch (error) {
        res.status(500).json({"message":error.message});
    }
}

const editRolesUser = async(req,res) => {
    if(!req?.body?.id)
        return res.status(400).json({"message":"User ID required"});
    const user = await User.findOne({_id: req.body.id}).exec();
    if(!user)
    {
        return res.status(400).json({ 'message': `User ID ${req.body.id} not found` });
    }
    if(req.body?.roles) user.roles = req.body.roles;
    const result = await user.save();
    res.json(result);
}

const getUserJWT = async(req,res) => {
    if(!req.user)
        return res.status(400).json({ "message": 'User must be logged in' });
    const user = await User.findOne({ username:req.user}).exec();
    if(!user)
    {
        return res.status(204).json({'message': `Username ${req.params.id} not found` })
    }
    // API is avaiable to everyone we will use this as a secert protecter
    user.password = "SECRET-PASSWORD";
    user.refreshToken = "SECERT-REFRESH";
    res.json(user);
}

const getUser = async(req,res) => {
    if(!req.params?.id)
        return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id:req.params.id}).exec();
    if(!user)
    {
        return res.status(204).json({'message': `User ID ${req.params.id} not found` })
    }
    // API is avaiable to everyone we will use this as a secert protecter
    user.password = "SECRET-PASSWORD";
    user.refreshToken = "SECERT-REFRESH";
    console.log(user)
    res.json(user);
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUserJWT,
    editRolesUser,
    getUser
}