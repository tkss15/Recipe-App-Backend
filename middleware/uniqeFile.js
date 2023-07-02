const {v4:uuidv4} = require('uuid');
const crypto = require("crypto");

const uniqeFile = (req,res,next) => {
    const id = crypto.randomBytes(16).toString("hex");
    req.imageId = id;
    next();
}

module.exports = uniqeFile;