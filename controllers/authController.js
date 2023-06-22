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
    res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    res.sendStatus(204);
}
const handleRefresh = async(req,res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt)
        return res.sendStatus(401);
    /**
     * if(cookies && cookies.jwt)
     */
    
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser)
    {
        return res.sendStatus(204);
    }
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECERT,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username)
                return res.sendStatus(403);
            
            const accessToken = createToken({"username": foundUser.username, "firstname": foundUser.firstname,
            "lastname": foundUser.lastname,"email": foundUser.email});
        
            res.status(200).json({accessToken});
        }
    );
    
}

const handleLogin = async(req,res) => {
    try {
        const {username,pwd} = req.body;

        if(!username || !pwd)
            res.status(400).json({"message":"Missing few fields in user register."}); 
        
        const foundUser = await User.findOne({username:username}).exec();
        if(!foundUser) 
            return res.sendStatus(401);
        
        const isValid = await bcrypt.compare(pwd,foundUser.password);
        if(!isValid)
            res.status(401).json({"message":"username or password dosent match"});

        const accessToken = createToken({"username": foundUser.username, "firstname": foundUser.firstname,
        "lastname": foundUser.lastname,"email": foundUser.email});

        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECERT,
            { expiresIn: '1d' }
        )
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.json({accessToken});

    } catch (error) {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogout,
    handleRefresh,
    handleLogin
}