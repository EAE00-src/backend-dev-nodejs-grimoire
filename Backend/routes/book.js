const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//GET Routes
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getABook);
router.get('/bestrating', bookCtrl.getTopRatedBooks);
//POST Routes
router.post('/', auth, multer, bookCtrl.createABook);
router.post('/:id/rating', auth, bookCtrl.rateABook);