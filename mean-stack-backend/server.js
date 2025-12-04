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

// --- Middleware ---
// CRITICAL: Configure CORS to allow your Frontend VM (e.g., at 192.168.10.20 on port 4200)

app.use(cors({
    origin: ['http://192.168.10.10:4200',
	    'http://192.168.91.128:4200',
	    'http://192.168.41.128:4200',
	    'http://localhost:4200'
	    ], 
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

// 1. Landing/Health Check Route
app.get('/api/landing', (req, res) => {
    res.send('Backend running successfully!');
});

// 2. Registration Route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, email});

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 3. Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token }); 
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// ------------------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
