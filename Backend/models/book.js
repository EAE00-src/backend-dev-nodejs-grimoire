const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    author: {type: String, required: true},
        titleNormalized: {type: String, select: false}, //hidden from Frontend requests by default
        authorNormalized: {type: String, select: false}, //normalized strings will be used for duplication checks
    imageUrl: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: String, required: true},
    ratings: [
        {
            userId: {type: String, required: true},
            grade: {type: Number, required: true, min: 0, max: 5}
        }
    ],
    averageRating: {type: Number, default: 0}
});
//pre('save') hook automatically populates/normalizes from...
    //...the title and author before saving the whole document
bookSchema.pre('save', function (next) {
    if(this.title) {this.titleNormalized = this.title.trim().toLowerCase();}
    if(this.author) {this.authorNormalized = this.author.trim().toLowerCase();}
    next();
});
//Compound Unique indexes (case-insensitive duplicates are caught)
bookSchema.index({titleNormalized: 1, authorNormalized: 1}, {unique: true});

module.exports = mongoose.model('Book', bookSchema);