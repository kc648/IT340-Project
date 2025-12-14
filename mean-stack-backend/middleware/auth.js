const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('❌ NO AUTH HEADER');
    return res.status(401).json({ msg: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    console.log('🟡 FULL DECODED TOKEN:', decoded);
    console.log('🟡 decoded.user:', decoded.user);
    console.log('🟡 decoded.user?.id:', decoded.user?.id);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('❌ TOKEN VERIFY FAILED:', err.message);
    return res.status(401).json({ msg: 'Token not valid' });
  }
};


