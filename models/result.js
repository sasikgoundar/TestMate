const mongoose = require('mongoose');

const ResultSchema = new mongoose.schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    correctQues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        },
    ],
    wrongQues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        },
    ],
    percentScore: {
        type: Number,
        required: true,
    },
});

const Result = mongoose.model('Result', ResultSchema);
module.exports = Result;
