
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
        required: [true, 'Missed field: Message'],
        minlength: [5, 'Message must be 5 characters min.'],
    },
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    // 'type' identifies the unique ID for the association
    // 'ref' identifies what model the ID is associated with
    // one-to-many defined by being contained in array

}, {timestamps: true});