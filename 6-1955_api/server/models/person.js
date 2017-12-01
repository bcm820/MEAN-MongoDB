
const mongoose = require(`mongoose`);

const PersonSchema = new mongoose.Schema({
    name: { type: String, required: [true] },
});

mongoose.model('Person', PersonSchema);
