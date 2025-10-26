const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  const { username, password, email, name, rlNo, role } = req.body;
  try {
    // Check if user or email already exists
    const existingUser = await User.findOne({ $or: [ { username }, { email } ] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email, name, rlNo, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    // For now, just return a success message (no JWT/session yet)
    let userRole = user.role;
    if (!userRole && user.username === 'admin') userRole = 'admin';
    res.status(200).json({ message: 'Login successful', user: { username: user.username, id: user._id }, role: userRole });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 