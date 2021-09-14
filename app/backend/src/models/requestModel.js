const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let requestModel = new Schema ({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
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
    },
    email: {
        type: String
    },
    type: {
        type: String
    }
});

exports.RequestModel = mongoose.model('requests', requestModel, 'requests');
