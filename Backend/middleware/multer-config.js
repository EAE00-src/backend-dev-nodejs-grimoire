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

module.exports = multer({storage: storage}).single('image');