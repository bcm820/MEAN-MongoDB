
const mods = '../../node_modules';
const mongoose = require(`${mods}/mongoose`);

// Schema variable for models that require associations
const Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Missed field: Name'],
        minlength: [4, 'Name must be 4 characters min.']
    },
    text: {
        type: String,
        required: [true, 'Missed field: Comment'],
        minlength: [5, 'Comment must be 5 characters min.'],
    },
    _post: {type: Schema.Types.ObjectId, ref: 'Post'}
    // _ tells comment model it belongs to the post model

}, {timestamps: true})