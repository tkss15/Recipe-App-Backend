const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        if(!fs.existsSync(path.join(__dirname, "..", 'uploads')))
        {
            fs.mkdirSync(path.join(__dirname, "..", 'uploads'));
        }
        cb(null, 'uploads/')
    },
    filename: (req,file,cb) => {
        cb(null, `${req.imageId}`);
    }
})

const fileFilter = (req,file,cb) => {
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
    {
        cb(null,true);
    }
    cb(null,false);
}

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;