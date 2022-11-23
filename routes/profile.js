const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { cloudinary } = require('../utils/cloudinary');

router.post('/upload/:id', async (req, res) => {
  try {
    const fileStr = req.body.data;
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: 'movieApp',
    });
    console.log(result);

    const user = await User.findById(req.params.id);
    if (user.img.public_id) {
      await cloudinary.uploader.destroy(user.img.public_id);
    }
    user.img.url = result.secure_url;
    user.img.public_id = result.public_id;
    user.save();

    res.json({ message: 'upload and update succesful' });
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
