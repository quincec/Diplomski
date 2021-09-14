const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let bookModel = new Schema ({
    title: {
        type: String
    },
    link: {
        type: String
    },
    imgSrc: {
        type: String
    },
    author: {
        type: String
    },
    price: {
        type: String
    },
    bookstore: {
        type: String
    },
    multipleExist: {
        type: Number
    }
});

exports.BookModel = mongoose.model('books', bookModel, 'books');