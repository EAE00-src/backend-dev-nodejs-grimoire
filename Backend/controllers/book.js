const fileSys = require('fs');
const Book = require('../models/book');
const mongoose = require('mongoose');


/*** GET Controllers ***/
//Controller to GET all books from the database
exports.getAllBooks = (req, res, next) =>{
    Book.find().then((books) =>{
        res.status(200).json(books)
    }).catch((error) =>{
        res.status(400).json({error: error})
    });
};

//Controller to GET a specific book relative to its ID
exports.getABook = (req, res, next) =>{
    Book.findOne({_id: req.params.id}).then((book) =>{
        if(!book){
            return res.status(404).json({error: 'Book not found'})
        }
        res.status(200).json(book);
    }).catch((error) =>{
        console.error('Error retrieving book: ', error)
        res.status(500).json({error: 'Failed to retrieve book!'})
    });
};

//Controller to GET Top 3 Highest averageRatings
exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const topBooks = await Book.find()
      .sort({ averageRating: -1, _id: 1 }) //_id = tie-breaker for books with similar avg ratings
      .limit(3) //only return 3 books that qualify
      .select('title author imageUrl year genre averageRating');

    res.status(200).json(topBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*** POST Controllers ***/ 
//Controller to POST new Books
exports.createABook = (req, res, next) =>{
    const url = `${req.protocol}://${req.get('host')}`;
    req.body.book = JSON.parse(req.body.book);
    //Pre-checks for all required body fields, effectively reducing computational waste
    const {title, author, year, genre} = req.body.book;
    if(!title || !author || !year || !genre){
        return res.status(400).json({
            error: 'Title, author, year, and genre are required fields.'
        })
    };

    const book = new Book({
        userId: req.auth.userId,
        title: req.body.book.title,
        author: req.body.book.author,
        imageUrl: req.file ? 
            `${url}/images/${req.file.filename}` //From file
            : req.body.book.imageUrl, //from URL
        year: req.body.book.year,
        genre: req.body.book.genre,
        ratings: [], //always an array instead of 'undefined'
        averageRating: 0 //always a number but never missing
    });
    //Save POST content
    book.save().then(() =>{
        res.status(201).json({
            message: "Post saved successfully!"
        })
    }).catch((error) =>{
        res.status(400).json({
            error: error.message
        })
    });
}

//Controller to POST new ratings
exports.rateABook = async (req, res, next) =>{
    const bookId = req.params.id;
    const {grade} = req.body;
    const userId = req.auth.userId

    //Prechecks for a malformed or Invalid ObjectId 
    if(!mongoose.Types.ObjectId.isValid(bookId)){
        return res.status(400).json({error: 'Invalid Book Id'})
    };
    //If the grade value isn't a number or is less than 0 or greater than 5, return an error
    if(typeof grade !== 'number' || grade < 0 || grade > 5){
        return res.status(400).json({
            error: 'Grade must be a number and be greater than 0 and less than 5'
        })
    };

    try{
        const book = await Book.findById(bookId);
        //If the search for the specified book turns up false...
        if (!book) {
            return res.status(404).json({error: 'Book not found'})
        };

        //check if a rating already exists
        const existingRating = book.ratings.find(r => r.userId.toString() === userId);
        //If existingRating returns to be true, reject the new rating
        if(existingRating){
            return res.status(403).json({error: 'A rating from this user already exists!'})
        };

        //Add new rating if it passes the existing rating check
        book.ratings.push({ userId, grade});

        //update the averageRating
        const totalRatings = book.ratings.length;
        const sumGrades = book.ratings.reduce((sum, r) => sum + r.grade, 0);
        //book.averageRating first checks to see if totalRatings... 
            //...is any value other than 0 before calculating the average
        book.averageRating = totalRatings ? +(sumGrades / totalRatings).toFixed(1) : 0;
        //save the new rating
        try {
            await book.save();
            res.status(201).json({ message: 'Rating submitted successfully!', averageRating: book.averageRating });
            } catch (error) {
            res.status(400).json({ error: error.message });
        };// end of new rating save

    } catch(error){
        res.status(500).json({error: error.message})
    }
}



/*** PUT Controller ***/
//Controller for PUT requests
exports.modifyBook = (req, res, next) =>{
    const url = `${req.protocol}://${req.get('host')}`;

    if(req.file){
        req.body.book = JSON.parse(req.body.book);
    }

    //Find existing book
    Book.findById(req.params.id).then((existingBook) =>{
        if(!existingBook){
            return res.status(404).json({error: 'Book not found!'})
        }
        //Ownership match
        if(existingBook.userId.toString() !== req.auth.userId){
            return res.status(403).json({error: 'Unauthorized request! Not the original owner'})
        }

        const bookUpdate = {
        title: req.body.title ?? existingBook.title,
        author: req.body.author ?? existingBook.author,
        genre: req.body.genre ?? existingBook.genre,
        imageUrl: req.file ? 
            `${url}/images/${req.file.filename}`
            : (req.body.imageUrl ?? existingBook.imageUrl),
        ratings: existingBook.ratings,
        averageRating: existingBook.averageRating
    };

    //Update the Book document
    Book.updateOne({_id: req.params.id}, bookUpdate).then(() =>{
        res.status(200).json({
            message: 'Book updated successfully!'
        })
    }).catch((error) =>{
        res.status(400).json({error: 'Book update failed!'})
    });
    }).catch((error) =>{
        res.status(500).json({ error: error.message})
    })

    
}