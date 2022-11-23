const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    url: { type: String, required: true },
    public_id: { type: String },
  },
});

module.exports = mongoose.model('User', userSchema);
