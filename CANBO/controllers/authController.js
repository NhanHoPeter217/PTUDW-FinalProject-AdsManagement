const User = require('../models/Department/User');
const Token = require('../models/Authentication/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const crypto = require('crypto');
const { readdir } = require('fs');

const register = async (req, res) => {
    try {
        const user = await User.create({ ...req.body });
        res.status(StatusCodes.CREATED).json({
            user: {
                username: user.username
            },
            message: 'Register successfully'
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const { account, password } = req.body;

    if (!account || !password) {
        throw new BadRequestError('Please provide username/email and password');
    }

    // Tìm user theo username hoặc email
    const user = await User.findOne({
        $or: [{ username: account }, { email: account }]
    });

    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const tokenUser = createTokenUser(user);

    // create refresh token
    let refreshToken = '';
    // check for existing token
    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
            throw new CustomError.UnauthenticatedError('Invalid Credentials');
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        res.status(StatusCodes.OK).json({ user: tokenUser });
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };

    await Token.create(userToken);

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
    await Token.findOneAndDelete({ user: req.user.userId });

    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({
        message: 'Logout successfully'
    });

};

module.exports = {
    register,
    login,
    logout
};
