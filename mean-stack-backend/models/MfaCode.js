const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  codeHash: String,
  expiresAt: Date
});

// auto-delete expired codes
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('MfaCode', schema);


