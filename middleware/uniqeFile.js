const uuid = require('uuid');

const uniqeFile = (req,res,next) => {
    if(req.file)
    {
        const uuid4 = uuid.v4()
        req.imageId = uuid4;
    }
}

module.exports = uniqeFile;