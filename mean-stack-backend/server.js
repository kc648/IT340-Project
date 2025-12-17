console.log("This is the correct server.js version that has been fixed.");

require('dotenv').config(); 
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); // For token generation
const cors = require('cors'); // For cross-VM communication
const User = require('./models/User'); 

// Replace with your actual database VM IP and credentials
const mongoURI = 'mongodb://appuser:p%40ssw0rd123@192.168.10.30:27017/tune_in_daily_db'; 
const app = express();
const PORT = 3000;

const syslog = require('syslog-client');
const client = syslog.createClient("192.168.10.20");
// --- Middleware ---
// CRITICAL: Configure CORS to allow your Frontend VM (e.g., at 192.168.10.20 on port 4200)

app.use(cors({
    origin: ['http://192.168.10.10:4200',
	    'http://192.168.91.128:4200',
	    'http://192.168.41.128:4200',
	    'http://localhost:4200'
	    ],
allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true 
}));
app.use(bodyParser.json()); 
// ------------------

// --- DB Connection ---
mongoose.connect(mongoURI)
.then(() => {
    console.log('Connected to MongoDB!');
})
.catch((err) => {
    console.error('MongoDB connection error: ', err);
});

// --- Routes ---
const entryRoutes = require("./routes/entries");

app.use("/api/entries", entryRoutes);



// 1. Landing/Health Check Route
app.get('/api/landing', (req, res) => {
    res.send('Backend running successfully!');
});

// 2. Registration Route
// Registration Route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: 'Invalid email format' });
    }

    try {
        // 1️⃣ Check username availability
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ msg: 'Username unavailable' });
        }

        // 2️⃣ Check email availability
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: 'Email already in use' });
        }

        // 3️⃣ Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4️⃣ Create user after validation
        const user = new User({
            username,
            email,
            passwordHash
        });

        await user.save();
        return res.status(201).json({ msg: 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});



// 3. Login Route
// 3. Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

const payload = {
  user: {
    id: user._id
  }
};

const token = jwt.sign(
  payload,
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '1h' }
);

res.json({ token });



  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



// ------------------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
