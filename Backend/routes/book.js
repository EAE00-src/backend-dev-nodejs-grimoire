const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const optimizeImage = require('../middleware/sharp');

//GET Routes
router.get('/bestrating', bookCtrl.getTopRatedBooks);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getABook);

//POST Routes
router.post('/', auth, multer, optimizeImage, bookCtrl.createABook);
router.post('/:id/rating', auth, bookCtrl.rateABook);

//PUT Route
router.put('/:id', auth, multer, optimizeImage, bookCtrl.modifyBook);

//DELETE Route
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;