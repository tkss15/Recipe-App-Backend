const User = require('../models/Users');

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
    const result = await user.deleteOne({_id: req.body.id});
    console.log(result);
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
    getUser
}