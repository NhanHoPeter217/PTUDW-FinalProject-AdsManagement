const User = require('../models/Department/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getUserInfo = async (req, res) => {
    const {
        user: { userId }
    } = req;

    try {
        const infoUser = await User.findOne({
            _id: userId
        }).select('-password');

        if (!infoUser) {
            throw new NotFoundError(`No user with id ${userId}`);
        }

        res.status(StatusCodes.OK).json({ infoUser });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const updateUserInfo = async (req, res) => {
    const {
        body: { fullName, dateOfBirth, email, phone },
        user: { userId }
    } = req;

    try {
        if (email) {
            const user = await User.findOne({ email });
            if (user && user._id.toString() !== userId) {
                throw new BadRequestError('Email already taken');
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            { _id: userId },
            { fullName, dateOfBirth, email, phone },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            throw new NotFoundError(`No user with id ${userId}`);
        }

        res.status(StatusCodes.OK).json({ updatedUser });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
};

const updatePassword = async (req, res) => {
    const {
        body: { currentPassword, newPassword },
        user: { userId }
    } = req;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError(`No user with id ${userId}`);
        }

        const isPasswordCorrect = await user.comparePassword(currentPassword);

        if (!isPasswordCorrect) {
            throw new BadRequestError('Incorrect current password');
        }

        if (newPassword.length < 6) {
            throw new BadRequestError('Password is too short!');
        }

        user.password = newPassword;
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'Password updated successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
};

module.exports = {
    getUserInfo,
    updateUserInfo,
    updatePassword
};
