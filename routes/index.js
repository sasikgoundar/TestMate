const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('landing.ejs');
});

router.get('/profile', (req, res) => {
   res.render('profile.ejs');
});

module.exports = router;
