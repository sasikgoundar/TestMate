const mongoose = require('mongoose');

const ResultSchema = new mongoose.schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
    },
    username: {
        type: String,
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
    marks: {
        type: Number,
    },
});
