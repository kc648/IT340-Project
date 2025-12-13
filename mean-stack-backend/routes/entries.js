const express = require("express");
const router = express.Router();
const Entry = require("../models/Entry");
const auth = require("../middleware/auth");

// POST /api/entries
router.post("/", auth, async (req, res) => {
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

router.get("/", auth, async (req,res) => {
    const entries = await Entry.find({ userID: req.user.id });
    res.json(entries);
});

module.exports = router;


