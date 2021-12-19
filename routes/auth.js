const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

//show login form
router.get('/signin', function (req, res) {
   res.render('signin.ejs');
});

router.post('/register', async (req, res) => {
   try {
      console.log('om');
      console.log(req.body);
      const { fullname, university, username, password } = req.body;

      const user = new User({
         username: username,
         fullName: fullname,
         university: university,
      });

      const registedUser = await User.register(user, password);
      console.log(registedUser);
      req.flash('success', 'You are now registered!');

      res.redirect('/signin');
   } catch (error) {
      req.flash('danger', 'Email is already registered!');
      res.redirect('/signin');
   }
});

router.post('/login', (req, res, next) => {
   passport.authenticate('local', {
      failureRedirect: '/signin',
      successRedirect: '/home',
      failureFlash: true,
      successFlash: 'Welcome to TestMate ' + req.body.username + '!',
   })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success', 'Logged Out Successfully.');
   res.redirect('/signin');
});

module.exports = router;
