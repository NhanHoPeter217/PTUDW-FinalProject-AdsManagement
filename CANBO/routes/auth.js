const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const { getAllAccount, register, login, logout } = require('../controllers/authController');

router.get('/api/v1', authenticateUser, authorizePermissions('Sở VH-TT'), getAllAccount);
router.post('/register/api/v1', authenticateUser, authorizePermissions('Sở VH-TT'), register);
// router.post('/register', register);
router.get('/login', (req, res) => {
    res.render('commonFeatures/signin', { layout: false });
});

router.post('/login/api/v1', login);

router.delete('/logout/api/v1', authenticateUser, logout);

module.exports = router;
