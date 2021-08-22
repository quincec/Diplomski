const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.set('debug', true);

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
    }
});

exports.BookModel = mongoose.model('books', bookModel, 'books');