const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://192.168.10.30:27017/')
  .then(() => console.log('Logging DB connected'))
  .catch(err => console.error(err));

const Log = mongoose.model('Log', new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  level: String,
  source: String,
  event: String,
  userId: String,
  metadata: Object
}));

app.post('/log', async (req, res) => {
  await Log.create(req.body);
  res.sendStatus(204);
});

app.listen(4000, () => console.log('Logging service running on 4000'));


