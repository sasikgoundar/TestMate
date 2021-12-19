const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
   // emailId: {
   //    type: String,
   //    required: true,
   //    unique: true,
   // },
   fullName: {
      type: String,
      required: true,
   },
   university: {
      type: String,
   },
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

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = User;
