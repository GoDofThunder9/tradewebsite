
const mongoose = require('mongoose');

const form = new mongoose.Schema({

    First_name: {
        type: String,
        required: true
    },
    Last_name: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    Zip: {
        type: Number,
        required: true
    }
})
const Form = mongoose.model('Form', form);

module.exports = Form;