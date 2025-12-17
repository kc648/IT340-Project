const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  // 🔐 Which user owns this entry
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 📅 Calendar date (YYYY-MM-DD)
  date: {
    type: String,
    required: true
  },

  // 🎵 Song info
  songTitle: {
    type: String,
    trim: true
  },

  artist: {
    type: String,
    trim: true
  },

  // 📝 Main journal text
  entryText: {
    type: String,
    required: true
  },

  // ⏱ Metadata
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Entry", EntrySchema);



