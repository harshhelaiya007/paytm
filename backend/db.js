const mongoose = require('mongoose');

const mongodbURL = 'mongodb+srv://harshhelaiya5:Harsh%40007@cluster0.cngehgz.mongodb.net/paytm?retryWrites=true&w=majority';

// Connect to database
mongoose.connect('mongodb+srv://harshhelaiya6:jQSK4SmkYulX6RCu@cluster0.cngehgz.mongodb.net/');

mongoose.connection.on('error', error => {
  console.log('Connection Faild')
});

mongoose.connection.on('connected', connected => {
  console.log('connection successful')
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
});
// Add constraints and validations as needed

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});


// User Model
const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  Account,
};
