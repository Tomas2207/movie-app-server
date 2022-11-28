const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  id: {
    type: Number,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
  in_watchlist: {
    type: Boolean,
  },
  rating: {
    type: Number,
  },
});

module.exports = mongoose.model('Movie', movieSchema);
