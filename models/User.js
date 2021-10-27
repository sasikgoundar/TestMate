const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   // username:{
   //     type: String,
   //     required : true
   // },
   // password:{
   //     type: String,
   //     required : true
   // },
   emailId: {
      type: String,
      required: true,
      unique: true,
   },
   fullName: {
      type: String,
      required: true,
   },
   // university: {
   //     type: String,
   // },
   avgPercentScore: {
      type: Number,
      default: 0,
   },
   highestPercentScore: {
      type: Number,
      default: 0,
   },
   previousResults: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Result',
      },
   ],
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
