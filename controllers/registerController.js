const User = require("../models/Users");
const bcrypt = require('bcrypt')

const registerUser = async (req,res) => {
    try {
        if(req?.body === undefined)
            res.status(404).json({"message":"Missing few fields in user register."});

        const {username,pwd,firstname,lastname,email, confirm} = req.body;
        if(!username ||
            !pwd ||
            !firstname ||
            !lastname ||
            !email || 
            !confirm)
            res.status(404).json({"message":"Missing few fields in user register."});
        
        if(pwd !== confirm)
            res.status(404).json({"message":"Some fields does not meet the requrements."});
        
        const duplicatedUser = await User.findOne({username:username});
        const duplicatedEmail = await User.findOne({email:email});

        if(duplicatedUser)
            res.status(409).json({"message":"username taken already please try somthing else."});

        if(duplicatedEmail)
            res.status(409).json({"message":"email taken already please try somthing else."});

        const hashedPassword = await bcrypt.hash(pwd, 10);
        const result = User.create({
            username:username,
            password:hashedPassword,
            firstname:firstname,
            lastname:lastname,
            email:email
        });
        res.status(201).json({"Success": `New user ${username} have been created`});
    }
    catch(error)
    {
        res.status(500).json({'message': error.message});
    }
    
}

module.exports = {registerUser};