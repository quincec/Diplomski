const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.set('debug', true);

let orderModel = new Schema ({
    books: {
        type: Array
    },
    userId: {
        type: String
    },
    price: {
        type: String
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    phone: {
        type: String
    }
});

exports.OrderModel = mongoose.model('orders', orderModel, 'orders');