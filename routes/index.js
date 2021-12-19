const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');
const Result = require('../models/Result');
const Test = require('../models/Test');
const User = require('../models/User');

router.get('/', (req, res) => {
   res.render('landing.ejs');
});

router.get('/test', (req, res) => {
   res.render('lol.ejs');
});

router.get('/results/:resultid', async (req, res) => {
   const resultId = req.params.resultid;
   const foundResult = await Result.findById(resultId);
   const foundTest = await Test.findById(foundResult.testId);

   if (!foundResult) {
      return res.send('not found');
   }

   res.render('result.ejs', {
      resultId: resultId,
      testId: foundTest._id,
      testName: foundTest.testName,
      negativeMarks: foundTest.negativeMarks,
      testTotalMarks: foundTest.totalMarks,
   });
});

router.get('/signin', (req, res) => {
   res.render('signin.ejs');
});

router.get('/home', (req, res) => {
   res.render('home.ejs');
});

router.get('/test-success/:testid', (req, res) => {
   const testid = req.params.testid;
   res.render('testCreateSuccess.ejs', { testid });
});

router.get('/users/:userid', async (req, res) => {
   const userid = '61bc2d7cbee2f518d5555931';
   // const userid = req.params.userid
   const foundUser = await User.findById(userid).populate('previousResults');

   console.log(foundUser);
   res.render('profile.ejs');
});

router.get('/leaderboard/:testid', async (req, res) => {
   const testid = req.params.testid;
   const foundLeaderboard = await Leaderboard.findOne({ testId: testid })
      .populate('testId', ['testName', 'totalParticipants'])
      .populate('results', ['percentScore', 'userfullname', 'userId']);

   if (!foundLeaderboard) {
      return res.send('NOT FOUND');
   }

   console.log(foundLeaderboard);
   res.render('leaderboard.ejs', {
      test: foundLeaderboard.testId,
      results: foundLeaderboard.results,
   });
});

module.exports = router;
