console.log("This is the correct server.js version that has been fixed.");

require('dotenv').config(); 
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); // For token generation
const cors = require('cors'); // For cross-VM communication
const User = require('./models/User'); 
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const MfaCode = require('./models/MfaCode');
const { sendCode } = require('./utils/mailer');
const mailer = require('./utils/mailer');

// Replace with your actual database VM IP and credentials
const mongoURI = 'mongodb://appuser:p%40ssw0rd123@192.168.10.30:27017/tune_in_daily_db'; 
const app = express();
const PORT = 3000;

const syslog = require('syslog-client');
const client = syslog.createClient("192.168.10.20");

const generateCode = () => 
  Math.floor(100000 + Math.random() * 900000).toString();

const hashCode = (code) =>
  crypto.createHash('sha256').update(code).digest('hex');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_Pass,
  },
});

// --- Middleware ---
// CRITICAL: Configure CORS to allow your Frontend VM (e.g., at 192.168.10.20 on port 4200)

app.use(cors({
    origin: ['http://192.168.10.10:4200',
	    'http://192.168.91.128:4200',
	    'http://192.168.41.128:4200',
	    'http://localhost:4200',
	    'http://192.168.10.40:4000',
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

// === SIMPLE EMAIL MFA START ===

// generate code
const code = generateCode();
const codeHash = hashCode(code);

// remove old codes
await MfaCode.deleteMany({ userId: user._id });

// store new code (5 min expiry)
await MfaCode.create({
  userId: user._id,
  codeHash,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000)
});

// send email
await sendCode(user.email, code);

// tell frontend MFA is required
return res.json({
  mfaRequired: true,
  userId: user._id
});

// === SIMPLE EMAIL MFA END ===



  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



// ------------------------------------------

app.post('/api/mfa', async (req, res) => {
  const { userId, code } = req.body;

  const record = await MfaCode.findOne({ userId });
  if (!record) {
    return res.status(401).json({ msg: 'Code expired' });
  }

  if (hashCode(code) !== record.codeHash) {
    return res.status(401).json({ msg: 'Invalid code' });
  }

  await MfaCode.deleteOne({ _id: record._id });

  // NOW issue JWT
  const payload = {
    user: { id: userId }
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  res.json({ userId, token });
});

app.use('/api/log', require('./routes/log.routes'));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.listen(4000, '0.0.0.0', () => {
  console.log('Backend server running on port 4000');
});
