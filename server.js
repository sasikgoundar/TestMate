const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const ejsMate = require('ejs-mate');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const testRoutes = require('./routes/test');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User');

connectDB();

app.use(express.json());
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); //for serving static files
app.use(flash());
app.use(
   express.urlencoded({
      extended: true,
   }),
); //for parsing form data

app.use(
   session({
      secret: '#secret#',
      resave: true,
      saveUninitialized: true,
   }),
);

//========================PASSPORT SETUP=============================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//===================================================================

app.use(require('connect-flash')());

app.use(function (req, res, next) {
   //giving access of loggedIn user to every templates(in views dir)
   res.locals.currentUser = req.user;
   //giving access of loggedIn user's notifications to every templates(in views dir) (have to populate first though)

   res.locals.messages = require('express-messages')(req, res);
   next();
});

//====================middlewares===================================

app.use('/', authRoutes);
app.use('/', indexRoutes);
app.use('/', testRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`SERVER STARTED AT ${PORT}!`));
