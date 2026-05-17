const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./backend/models/User');

async function test() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event-registration');
    const username = 'testuser2';
    const password = 'password123';
    
    let user = new User({ username, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    console.log('User saved');
    mongoose.disconnect();
  } catch (e) {
    console.error('Error:', e);
    mongoose.disconnect();
  }
}
test();
