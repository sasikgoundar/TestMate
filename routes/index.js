const express = require('express');
const router = express.Router();

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

module.exports = router;
