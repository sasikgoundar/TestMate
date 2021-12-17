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
   submittedQAs: [],
   // submittedQAs: [
   //    {
   //       title: {
   //          type: String,
   //          required: true,
   //       },
   //       optionA: {
   //          type: String,
   //          required: true,
   //       },
   //       optionB: {
   //          type: String,
   //          required: true,
   //       },
   //       optionC: {
   //          type: String,
   //          required: true,
   //       },
   //       optionD: {
   //          type: String,
   //          required: true,
   //       },
   //       correctOption: {
   //          type: String,
   //          required: true,
   //       },
   //       mark: {
   //          type: Number,
   //          required: true,
   //       },
   //       submittedOption: {
   //          type: String,
   //          default: null,
   //       },
   //    },
   // ],
   correctQues: Number,
   wrongQues: Number,
   percentScore: {
      type: Number,
      required: true,
   },
   marksObtained: Number,
});

const Result = mongoose.model('Result', ResultSchema);
module.exports = Result;
