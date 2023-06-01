const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/')
    },
    filename: (req,file,cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
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