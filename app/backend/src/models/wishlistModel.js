const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.set('debug', true);

let wishlistModel = new Schema ({
    bookId: {
        type: String
    },
    userId: {
        type: String
    },
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

exports.WishlistModel = mongoose.model('wishlist', wishlistModel, 'wishlist');