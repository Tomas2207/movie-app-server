const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

//get watchlist
router.get('/:id', async (req, res) => {
  try {
    const watchlist = await Movie.find({ user: req.params.id });
    res.json(watchlist);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
});

//get one from watchlist
router.get('/movie/:id', async (req, res) => {
  try {
    const movie = await Movie.find({ id: req.params.id });
    res.json(movie);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
});

//delete from watchlist
router.delete('/movie/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const movie = await Movie.findById(req.params.id);
    await movie.remove();
    res.json({ message: 'removed succesfully' });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
});

router.post('/:id', async (req, res) => {
  try {
    const movie = new Movie({
      user: req.params.id,
      id: req.body.id,
      poster_path: req.body.poster_path,
    });

    const newMovie = await movie.save();
    res.json(newMovie);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//check watchlist status

router.get('/check/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const movie = await Movie.findOne({ id: req.params.id });
    res.json(movie);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
