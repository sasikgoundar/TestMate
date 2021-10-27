const mongoose = require('mongoose');
const Question = require('./Question');

const TestSchema = new mongoose.Schema({
   testName: {
      type: String,
      required: true,
   },
   questions: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Question',
      },
   ],
   totalMarks: {
      type: Number,
      required: true,
   },
   startDateTime: {
      type: Date,
      required: true,
   },
   endDateTime: {
      type: Date,
      required: true,
   },
   timeLimit: {
      type: Number,
      required: true,
   },
   totalParticipants: Number,
});

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;
