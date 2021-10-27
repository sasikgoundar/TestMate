const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
   testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   userfullname: String,
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
