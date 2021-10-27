const connectDB = require('./config/db');
// const mongoose = require('mongoose');
const Question = require('./models/Question');
const Test = require('./models/Test');
const User = require('./models/User');

connectDB();

// const question1 = {
//     title: 'color of water',
//     optionA: 'red',
//     optionB: 'blue',
//     optionC: 'green',
//     optionD: 'none',
//     correctOption: 'D',
// };

// Question.create(question1, function (err, newlyCreated) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(newlyCreated);
//         //redirect back to items page
//         // res.redirect("/items");
//     }
// });

// const question2 = {
//     title: 'state of water',
//     optionA: 'solid',
//     optionB: 'liquid',
//     optionC: 'gas',
//     optionD: 'none',
//     correctOption: 'B',
// };

// Question.create(question2, function (err, newlyCreated) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(newlyCreated);
//         //redirect back to items page
//         // res.redirect("/items");
//     }
// });

// const user1 = {
//    emailId: 'm@g.com',
//    fullName: 'meet g',
//    previousResults: [],
// };

// User.create(user1, function (err, newlyCreated) {
//    if (err) {
//       console.log(err);
//    } else {
//       console.log(newlyCreated);
//       //redirect back to items page
//       // res.redirect("/items");
//    }
// });
