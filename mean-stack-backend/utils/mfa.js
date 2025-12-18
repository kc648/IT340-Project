const crypto = require('crypto');

exports.generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.hashCode = code =>
  crypto.createHash('sha256').update(code).digest('hex');


