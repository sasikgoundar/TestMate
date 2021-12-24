const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

//show login form
router.get('/signin', function (req, res) {
   res.render('signin.ejs');
});

router.post(
   '/register',
   body('fullname', 'Name is required').notEmpty(),
   body('university', 'University is required').notEmpty(),
   body('username', 'Enter a valid Email-id').isEmail(),
   // req
   //   .checkBody("password", "password must be of minimum 6 characters")
   //   .isLength({ min: 6 });
   body('cpwd').custom((value, { req }) => {
      if (value !== req.body.password) {
         throw new Error('Password confirmation does not match password');
      }

      // Indicates the success of this synchronous custom validator
      return true;
   }),

   async (req, res) => {
      try {
         const { fullname, university, username, password } = req.body;

         const errors = validationResult(req);
         if (errors.errors.length > 0) {
            req.flash('danger', errors.errors[0].msg);
            res.redirect('back');
         } else {
            const user = new User({
               username: username,
               fullName: fullname,
               university: university,
            });

            const registedUser = await User.register(user, password);
            console.log(registedUser);
            req.flash('success', 'You are now registered!');

            res.redirect('/signin');
         }
      } catch (error) {
         console.log(error);
         req.flash('danger', 'Email is already registered!');
         res.redirect('/signin');
      }
   },
);

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
