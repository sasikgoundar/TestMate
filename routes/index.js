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

// router.get('/test/:user_id', (req, res) => {
//    const result = {
//       testId: '61c0486fe021e94992a56dee',
//       userId: '61bf09b3ac4d120c7881d728',
//       userfullname: 'Sasii',
//       submittedQAs: ['61c0486fe021e94992a56dea', '61c0486fe021e94992a56dec'],
//       correctQues: 1,
//       wrongQues: 0,
//       percentScore: 100,
//       marksObtained: 5,
//    };

//    Result.create(result, function (err, newly) {
//       if (err) {
//          console.log(err);
//       } else {
//          console.log(newly);
//          res.send('Success');
//       }
//    });
// });

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
   const foundUser = await User.findById(userid).populate('previousResults');
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
   avgRank = avgRank / length1 + 1;
   const avgScore = Number(Number(sum) / Number(length));
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
   });
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
