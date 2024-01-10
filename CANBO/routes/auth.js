const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const { register, login, logout } = require('../controllers/authController');

router.post('/register', authenticateUser, authorizePermissions('Sở VH-TT'), register);
// router.post('/register', register);
router.get('/login', (req, res) => {
    res.render('commonFeatures/signin', { layout: false });
});

router.post('/login/api/v1', login);

router.delete('/logout', authenticateUser, logout);

module.exports = router;
