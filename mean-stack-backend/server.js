const mongoose = require('mongoose');
const mongoURI = 'mongodb://appuser:p%40ssw0rd123@192.168.10.30:27017/tune_in_daily_db';
const express = require('express');
const app = express();
const PORT = 3000;

mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to MongoDB!');
})
.catch((err) => {
  console.error('MongoDB connection error: ', err);
});

app.get('/', (req, res) => {
  res.send('Backend running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
