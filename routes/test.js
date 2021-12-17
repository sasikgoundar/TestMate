const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Result = require('../models/Result');
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const moment = require('moment');
// const mongoose = require('mongoose');

router.get('/create_test', (req, res) => {
   res.render('createTest.ejs');
});

router.get('/result', async (req, res) => {
   res.render('result.ejs');
});

router.get('/getQuestions/:testid', async (req, res) => {
   const testid = req.params.testid;
   const foundTest = await Test.findById(testid).populate('questions');
   res.json(foundTest);
});

router.get('/attemptTest/:testid', async (req, res) => {
   const testid = req.params.testid;

   const foundTest = await Test.findById(testid);

   // console.log(Date.now());
   // console.log(foundTest.startDateTime);
   // console.log(Date.now() <= foundTest.startDateTime);

   if (Date.now() < foundTest.startDateTime) {
      const time = moment(foundTest.startDateTime).format(
         'MMMM Do YYYY, h:mm a',
      );
      console.log(time);
      //test not started yet
      return res.render('testUnavailable.ejs', {
         msg1: 'Test Has Not Started Yet!',
         msg2: 'It will start at',
         time: time,
      });
   }
   if (Date.now() >= foundTest.endDateTime) {
      time = moment(foundTest.endDateTime).format('MMMM Do YYYY, h:mm a');
      console.log(time);
      //test finished
      return res.render('testUnavailable.ejs', {
         msg1: 'Test Has Ended!',
         msg2: 'It had ended on',
         time: time,
      });
   }
   // test is available
   res.render('testAttemptPage.ejs', {
      testId: testid,
      testName: foundTest.testName,
      negativeMarks: foundTest.negativeMarks,
      timeLimit: foundTest.timeLimit,
   });
});

router.post('/attemptTest/:testid', async (req, res) => {
   console.log('post route called!');
   const testid = req.params.testid;

   //fetch original test questionanswers first
   const foundTest = await Test.findById(testid).populate('questions', [
      'correctOption',
      'mark',
   ]);
   const originalQuestions = foundTest.questions;
   // console.log('ogques:  ', originalQuestions);

   //fetch submitted test questionsanswers
   const submittedQuestions = req.body;

   console.log(submittedQuestions);

   // const submittedQuestions = [
   //    {
   //       _id: '6177b09987796bd08b853611',
   //       submittedOption: 'A',
   //    },
   //    {
   //       _id: '6177b0ee2c41c465a9289cab',
   //       submittedOption: 'B',
   //    },
   // ];

   // fetch other user details
   const userid = '61bc331d68f6f69fbba2c523';
   // const userid = req.user;

   //compute score
   let correctQuestions = 0;
   let wrongQuestions = 0;
   let marks = 0;
   let percentScore = 0;

   //assuming originalQuestions and submittedQuestions arrays are same order
   for (let i = 0; i < submittedQuestions.length; i++) {
      if (submittedQuestions[i].submittedOption == null) {
         continue;
      } else if (
         originalQuestions[i].correctOption ==
         submittedQuestions[i].submittedOption
      ) {
         correctQuestions++;
         marks += originalQuestions[i].mark;
      } else {
         wrongQuestions++;
         marks -= foundTest.negativeMarks;
      }
   }

   percentScore = (marks / foundTest.totalMarks) * 100;
   percentScore = percentScore.toFixed(2);

   // console.log(percentScore);
   // console.log(correctQuestions);
   // console.log(wrongQuestions);

   const foundUser = await User.findById(userid);
   // console.log(foundUser);

   //generate result
   let result = new Result({
      testId: testid,
      userId: userid,
      userfullname: foundUser.fullName,
      submittedQAs: submittedQuestions,
      correctQues: correctQuestions,
      wrongQues: wrongQuestions,
      percentScore: percentScore,
      marksObtained: marks,
   });

   const newResult = await result.save();
   foundTest.totalParticipants++;
   foundTest.save();

   foundUser.previousResults.push(newResult);
   foundUser.save();

   //updating leaderboard

   let foundLeaderboard = await Leaderboard.findOne({
      testId: testid,
   }).populate('results', ['percentScore']);
   // console.log('sss', foundLeaderboard.results);
   if (!foundLeaderboard) {
      //1st submission for the test

      foundLeaderboard = new Leaderboard({
         testId: testid,
         results: [newResult],
      });
   } else {
      //leaderboard already exists

      //insert result at suitable sorted index

      foundLeaderboard.results.splice(
         findLoc(result, foundLeaderboard.results) + 1,
         0,
         result,
      );
      function findLoc(el, arr) {
         for (i = 0; i < arr.length; i++) {
            // console.log(arr[i].percentScore);
            // console.log(el.percentScore);
            if (arr[i].percentScore < el.percentScore) return i - 1;
         }
         return arr.length;
      }
   }

   await foundLeaderboard.save();
});

module.exports = router;
