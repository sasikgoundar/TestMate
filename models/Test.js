const mongoose = require('mongoose');

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
});

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;
