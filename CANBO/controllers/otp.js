const OTP = require('../models/Authentication/otp');
const generateOTP = require('../utils/generateOTP');
const { hashData, verifyHashedData } = require('../utils/hashData');
const sendEmail = require('../utils/sendEmail');
const fs = require('fs').promises;
const path = require('path');

const { AUTH_EMAIL } = process.env;

const verifyOTP = async ({ email, otp }) => {
    try {
        if (!(email && otp)) {
            throw Error('Provide values for email, otp');
        }

        const matchedOTPRecord = await OTP.findOne({
            email
        });

        if (!matchedOTPRecord) {
            throw Error('No otp records found.');
        }

        const { expiresAt } = matchedOTPRecord;

        if (expiresAt < Date.now()) {
            await OTP.deleteOne({ email });
            throw Error('Code has expired. Request for a new one.');
        }

        const hashedOTP = matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp, hashedOTP);
        return validOTP;
    } catch (error) {
        throw error;
    }
};

const sendOTP = async ({ email, subject, duration = 5 }) => {
    try {
        if (!(email && subject)) {
            throw Error('Provide values for email, subject');
        }

        await OTP.deleteOne({ email });

        const generatedOTP = await generateOTP();

        const htmlContent = await fs.readFile(
            path.join(__dirname, '../public/html/mailContent.html'),
            'utf8'
        );

        const replacedHTML = htmlContent.replace('{{generatedOTP}}', generatedOTP);

        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject,
            html: replacedHTML
        };
        await sendEmail(mailOptions);

        const hashedOTP = await hashData(generatedOTP);
        const newOTP = await new OTP({
            email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 60000 * +duration
        });

        const createdOTPRecord = await newOTP.save();
        return createdOTPRecord;
    } catch (error) {
        throw error;
    }
};

const deleteOTP = async (email) => {
    try {
        await OTP.deleteOne({ email });
    } catch (error) {
        throw error;
    }
};

module.exports = { sendOTP, verifyOTP, deleteOTP };
