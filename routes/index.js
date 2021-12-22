const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');
const Result = require('../models/Result');
const Test = require('../models/Test');
const User = require('../models/User');
var moment = require('moment');

const isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      req.flash('danger', 'Please Log In First!');
      return res.redirect('/signin');
   }
   next();
};

router.get('/', (req, res) => {
   res.render('landing.ejs');
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

router.get('/home', isLoggedIn, (req, res) => {
   res.render('home.ejs');
});

router.get('/test-success/:testid', (req, res) => {
   const testid = req.params.testid;
   res.render('testCreateSuccess.ejs', { testid });
});

router.get('/users/:userid', async (req, res) => {
   const userid = req.params.userid;
   const foundUser = await User.findById(userid).populate({
      path: 'previousResults',
      populate: { path: 'testId' },
   });

   var sum = 0;
   var length = 0;
   var length1 = 0;
   var arr = [];
   var maxScore = 0;
   var ress;
   var final_rank = [];
   var tot_ranks = [];
   var avgRank = 0;
   var bestRank = 100000;
   var avgScore = 0;
   for (var i = 0; i < foundUser.previousResults.length; i++) {
      var tests = await Result.findById(foundUser.previousResults[i]).populate(
         'testId',
      );
      arr.push(tests);
      sum = sum + tests.percentScore;
      length++;
      if (tests.percentScore > maxScore) {
         maxScore = tests.percentScore;
      }
   }
   for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var test_id = item.testId._id;
      ress = await Leaderboard.findOne({ testId: test_id });
      tot_ranks.push(ress.results.length);
      const resultss = await ress.results.indexOf(item._id);
      final_rank.push(resultss);
      if (resultss + 1 < bestRank) {
         bestRank = resultss + 1;
      }
      avgRank = avgRank + resultss;
      length1++;
   }

   const labels = [];
   const graphData = [];
   foundUser.previousResults.forEach((result) => {
      labels.push(result.testId.testName);
      graphData.push(result.percentScore);
   });
   if (length1 != 0) {
      avgRank = avgRank / length1 + 1;
   }
   if (length != 0) {
      avgScore = Number(Number(sum) / Number(length));
   }
   if (bestRank == 100000) {
      bestRank = 0;
   }
   res.render('profile.ejs', {
      user: foundUser,
      avgScore: avgScore,
      maxScore: maxScore,
      tests: arr,
      moment: moment,
      rank: final_rank,
      idx: -1,
      tot_ranks: tot_ranks,
      bestRank: bestRank,
      avgRank: avgRank,
      labels: labels,
      graphData: graphData,
      currentUser: foundUser,
   });
});

router.get('/leaderboard/:testid', async (req, res) => {
   const testid = req.params.testid;
   const logged_in_user = await User.findById(req.user._id);

   const foundLeaderboard = await Leaderboard.findOne({ testId: testid })
      .populate('testId', ['testName', 'totalParticipants'])
      .populate('results', ['percentScore', 'userfullname', 'userId']);

   if (!foundLeaderboard) {
      return res.send('NOT FOUND');
   }

   console.log(foundLeaderboard.results);
   const results = foundLeaderboard.results;

   var logged_in_percentScore = '-';

   function check(result) {
      if (result.userId.equals(logged_in_user._id)) {
         logged_in_percentScore = result.percentScore;
         return true;
      }
   }

   logged_in_rank = results.findIndex(check);

   res.render('leaderboard.ejs', {
      test: foundLeaderboard.testId,
      results: foundLeaderboard.results,
      logged_in_user: logged_in_user,
      logged_in_rank: logged_in_rank,
      logged_in_percentScore: logged_in_percentScore,
   });
});

module.exports = router;
