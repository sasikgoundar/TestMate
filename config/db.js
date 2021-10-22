const mongoose = require('mongoose');

const dbUrl = 'mongodb://localhost:27017/testmate';
// const dbUrl = process.env.MY_MONGODB_URI;

module.exports = connectDB = async () => {
   try {
      await mongoose.connect(dbUrl, {
         useUnifiedTopology: true,
         useNewUrlParser: true,
      });
      console.log('DATABASE CONNECTED');
   } catch (err) {
      console.error(err.message);
      process.exit(1);
   }
};
