const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const ejsMate = require('ejs-mate');
const indexRoutes = require('./routes/index');
const testRoutes = require('./routes/test');
const Test = require('./models/Test');
const moment = require('moment');

// connectDB();

app.use(express.json());
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); //for serving static files

app.use(
   express.urlencoded({
      extended: true,
   }),
); //for parsing form data

app.post('/testing', (req, res) => {
   console.log(req.body.test);
   const test = req.body.test;
   const start = moment(test.startdatetime, 'DD-MM-YYYY hh:mm').toDate();
   const last = moment(test.lastdatetime, 'DD-MM-YYYY hh:mm').toDate();
   // console.log(myDate);

   // const totalmarks =
   let negmarks;
   if (test.negmarks == 'No') negmarks = 0;
   else negmarks = int(test.negmarks);

   const newtest = {
      testName: test.testname,
      questions: ['6177b09987796bd08b853611', '6177b0ee2c41c465a9289cab'],
      startDateTime: start,
      endDateTime: last,
      timeLimit: test.timelimit,
      negativeMarks: negmarks,
      totalMarks: totalmarks,
   };

   Test.create(newtest, function (err, newlyCreated) {
      if (err) {
         console.log(err);
      } else {
         console.log(newlyCreated);
         //redirect back to items page
         // res.redirect("/items");
      }
   });
});

app.use('/', indexRoutes);
app.use('/', testRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`SERVER STARTED AT ${PORT}!`));
