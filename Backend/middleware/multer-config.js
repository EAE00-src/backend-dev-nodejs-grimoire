const multer = require('multer');

const MIME_TYPES = {
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.diskStorage({
    destination:(req, file, callback) =>{
        callback(null, 'images');
    },
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ')
            .join('_')
            .replace(/[^a-zA-Z0-9_\-\.]/g, '')
            .replace(/\.[^/.]+$/, '');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, `${name}_${Date.now()}.${extension}`)
    }
});

//File filtering for additional enforcement
const fileFilter = (req, file, callback) =>{
    if(MIME_TYPES[file.mimetype]){
        callback(null, true); //accept the new file since it is an allowed mimetype
    } else{
        //reject the file if it isn't an expected image mimetype or not an image at all
        callback(new Error('Invalid file type! Only images are allowed! (jpeg, jpg, png, webp)'), false);
    }
}

module.exports = multer({storage: storage}).single('image');