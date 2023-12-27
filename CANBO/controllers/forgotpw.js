const User = require('../models/Department/User');
const { sendOTP, verifyOTP, deleteOTP } = require('../controllers/otp');
const { hashData } = require('../utils/hashData');

const resetUserPassword = async ({ email, otp, newPassword }) => {
    try {
        const validOTP = await verifyOTP({ email, otp });
        if (!validOTP) {
            throw Error('Invalid code passed. Check your inbox.');
        }
        if (newPassword.length < 6) {
            throw Error('Password is too short!');
        }

        const hashedNewPassword = await hashData(newPassword);
        await User.updateOne({ email }, { password: hashedNewPassword });
        await deleteOTP(email);

        return;
    } catch (error) {
        throw error;
    }
};

const sendPasswordResetOTPEmail = async (email) => {
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("There's no account for the provided email.");
        }

        const otpDetails = {
            email,
            subject: 'Password Reset',
            duration: 5
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendPasswordResetOTPEmail, resetUserPassword };
