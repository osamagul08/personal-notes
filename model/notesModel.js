const mongoose = require('mongoose');

const notesSechema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, ' Notes not be null']
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User id not be null']
    }
})

notesSechema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'email fullname gender'
    })
    next();
})

const Notes = mongoose.model('Notes', notesSechema);

module.exports = Notes;