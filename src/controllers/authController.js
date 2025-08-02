const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.signup = async (req, res) => {
  try {
    const { phone, pin } = req.body;
    if (!/^\d{10}$/.test(phone) || pin.length !== 4) {
      return res.status(400).json({ message: 'Invalid phone or pin format' });
    }
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPin = await bcrypt.hash(pin, 10);
    const user = new User({ phone, pin: hashedPin });
    await user.save();

     const userData = {
      _id: user._id,
      phone: user.phone,
      // Add other public fields if needed
    };

    
    res.status(201).json({ message: 'User registered successfully' , user : userData});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, pin } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
     // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // use HTTPS in production
      sameSite: 'Lax', // or 'Strict' or 'None' if using cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Optionally remove sensitive info before sending
    const userData = {
      _id: user._id,
      phone: user.phone,
      // Add other public fields if needed
    };

    res.json({ message: 'Login successful', user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 