const express = require("express");
const router = express.Router();
const Entry = require("../models/Entry");
const auth = require("../middleware/auth");
const mongoose = require('mongoose');

// POST /api/entries
router.post("/", auth, async (req, res) => {
  console.log('AUTH USER (POST): ', req.user);
  console.log('BODY FROM ANGULAR: ', req.body);
  try {
    const { date, songTitle, artist, entryText } = req.body;

    const entry = new Entry({
      userId: req.user.id,
      date,
      songTitle,
      artist,
      entryText
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ALL entries for logged-in user
router.get('/', auth, async (req, res) => {
  console.log('AUTH USER (GET): ', req.user);
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    console.log('QUERYING FOR userId: ', userObjectId);

    const entries = await Entry.find({ userId: userObjectId })
      .sort({ date: -1, createdAt: -1 });
    
    console.log('BACKEND RETURNING ENTRIES: ');
    console.log(entries);

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// GET single entry by ID for logged-in user
router.get('/:id', auth, async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const entry = await Entry.findOne({
      _id: req.params.id,
      userId: userObjectId
    });

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE single entry
router.delete('/:id', async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete entry.' });
  }
});

module.exports = router;


