const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.post('/', (req, res) => {
  const { event, source, userId, metadata } = req.body;

  if (!event || !source) {
    return res.status(400).json({ message: 'Invalid log payload' });
  }

  const logMessage =
    `${event} | source=${source} | user=${userId || 'anon'} | meta=${JSON.stringify(metadata || {})}`;

  exec(`/usr/local/bin/log_to_vm2.sh "${logMessage}"`);

  res.status(200).json({ message: 'Logged' });
});

module.exports = router;


