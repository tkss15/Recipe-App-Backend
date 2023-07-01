const User = require('../models/Users');
const bcrypt = require('bcrypt');
const { response } = require('express');
const jwt = require('jsonwebtoken');

const createToken = (userInfo) => {
    return jwt.sign(
        {"UserInfo":userInfo},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );
}

const handleLogout = async(req,res) => 
{
    const cookies = req.cookies;
    if(!cookies?.jwt)
        return res.sendStatus(401);
    const refreshToken = cookies.jwt;  

    const foundUser = await User.findOne({refreshToken}).exec();
    if(foundUser)
    {
        foundUser.refreshToken = "";
        await foundUser.save();
    }
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    res.sendStatus(204);
}
const handleRefresh = async(req,res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt)
        return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser)
    {
        return res.sendStatus(403);
    }
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECERT,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username)
                return res.sendStatus(403);
            
            const roles = Object.values(foundUser.roles);
            const accessToken = createToken({
                "username": decoded.username, 
                "firstname": decoded.firstname,
                "lastname": decoded.lastname,
                "email": decoded.email, 
                "roles": roles});
        
            res.status(200).json({roles,accessToken});
        }
    );
    
}

const handleLogin = async(req,res) => {
    try {
        const {username,pwd} = req.body;

        if(!username || !pwd)
              return res.status(400).json({"message":"Missing few fields in user register."}); 
        
        const foundUser = await User.findOne({username:username}).exec();
        if(!foundUser) 
            return res.status(401).json({"message":"User not found."});
        
        const isValid = await bcrypt.compare(pwd,foundUser.password);
        if(!isValid)
           return res.status(401).json({"message":"username or password dosent match."});
        
        const roles = Object.values(foundUser.roles).filter(Boolean);
        const accessToken = createToken({
            "username": foundUser.username, 
            "firstname": foundUser.firstname,
            "lastname": foundUser.lastname,
            "email": foundUser.email, 
            "roles":roles});

        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECERT,
            { expiresIn: '1d' }
        )
        foundUser.refreshToken = refreshToken;
        
        const result = await foundUser.save();
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.json({accessToken, roles});

    } catch (error) {
        return res.status(500).json({"message":error.message});
    }
}

module.exports = {
    handleLogout,
    handleRefresh,
    handleLogin
}