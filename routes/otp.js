const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otp');
const router = express.Router();

router.post('/verify', async (req, res) => {
    try {
        let { email, otp } = req.body;

        const validOTP = await verifyOTP({ email, otp });
        res.status(200).json({ valid: validOTP });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { email, subject, duration } = req.body;

        const createdOTP = await sendOTP({
            email,
            subject,
            duration
        });
        res.status(200).json(createdOTP);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
