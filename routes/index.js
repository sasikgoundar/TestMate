const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');

router.get('/', (req, res) => {
   res.render('landing.ejs');
});
router.get('/signin', (req, res) => {
   res.render('signin.ejs');
});

router.get('/profile', (req, res) => {
   res.render('profile.ejs');
});

router.get('/create_test', (req, res) => {
   res.render('createTest.ejs');
});

router.get('/leaderboard/:leaderboardid', async (req, res) => {
   const leaderboardId = req.params.leaderboardid;
   const foundLeaderboard = await Leaderboard.findById(leaderboardId)
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
