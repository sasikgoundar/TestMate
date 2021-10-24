const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   optionA: {
      type: String,
      required: true,
   },
   optionB: {
      type: String,
      required: true,
   },
   optionC: {
      type: String,
      required: true,
   },
   optionD: {
      type: String,
      required: true,
   },
   correctOption: {
      type: String,
      required: true,
   },
   //    mark:{
   //     type: Number,
   //     required: true,
   //    }
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
