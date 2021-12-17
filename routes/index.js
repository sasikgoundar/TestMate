const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');

router.get('/', (req, res) => {
   res.render('landing.ejs');
});

router.get('/signin', (req, res) => {
   res.render('signin.ejs');
});

router.get('/home', (req, res) => {
   res.render('home.ejs');
});

router.get('/profile', (req, res) => {
   res.render('profile.ejs');
});

router.get('/create_test', (req, res) => {
   res.render('createTest.ejs');
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
