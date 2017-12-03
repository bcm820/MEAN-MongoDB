
const mongoose = require(`mongoose`);

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: [true] },
    description: {type: String},
    status: {
        type: String,
        enum: ['To Do','Doing', 'Done'],
        default: 'To Do'
    },
}, {timestamps: true});

mongoose.model('Task', TaskSchema);
