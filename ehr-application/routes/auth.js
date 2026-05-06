const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('pages/login', { error: null });
});

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('pages/login', { error: 'Please enter both username and password' });
  }

  const user = store.users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.render('pages/login', { error: 'Invalid username or password' });
  }

  req.session.user = { id: user.id, username: user.username, name: user.name, role: user.role };
  res.redirect('/dashboard');
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
