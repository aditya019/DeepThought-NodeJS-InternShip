const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title : {
        type: String,
        required: true,
        maxlength: 50
    },
    author : {
        type: String,
        required: true,
        maxlength: 50
    },
    description : {
        type: String,
        maxlength: 100
    }
});

module.exports = mongoose.model('Book', bookSchema);