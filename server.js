const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const ejsMate = require('ejs-mate');
const indexRoutes = require('./routes/index');

// connectDB();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); //for serving static files

app.use('/', indexRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`SERVER STARTED AT ${PORT}!`));
