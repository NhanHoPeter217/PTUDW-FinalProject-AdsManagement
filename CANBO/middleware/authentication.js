const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const Token = require('../models/Authentication/Token');
const { attachCookiesToResponse, attachIdentiferToResponse } = require('../utils');
const Identifier = require('../models/Authentication/Identifier');
const crypto = require('crypto');

const authenticateUser = async (req, res, next) => {
    const { refreshToken, accessToken } = req.signedCookies;
    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken);
            req.user = payload.user;
            return next();
        }
        const payload = isTokenValid(refreshToken);

        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        });

        if (!existingToken || !existingToken?.isValid) {
            throw new CustomError.UnauthenticatedError('Authentication Invalid');
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken
        });

        req.user = payload.user;
        next();
    } catch (error) {
        res.redirect('/auth/login');
    }
};

const authenticateResidentOfCreateReport = async (req, res, next) => {
    const { identifier } = req.signedCookies;
    try {
        if (identifier) {
            console.log('had identifier');
            const payload = isTokenValid(identifier);
            const existingIdentifier = await Identifier.findOne({
                residentID: payload.resident.residentID
            });

            if (!existingIdentifier || !existingIdentifier?.isValid) {
                throw new CustomError.UnauthenticatedError('Resident Authentication Invalid');
            }
            attachIdentiferToResponse({ res, resident: payload.resident });
            console.log('payload', payload.resident.residentID);

            req.residentID = payload.resident.residentID;
            return next();
        } else {
            console.log('did not have identifier');
            const residentID = Date.now().toString() + crypto.randomBytes(40).toString('hex');
            const userAgent = req.headers['user-agent'];
            const ip = req.ip;
            const residentIdentifier = { residentID, ip, userAgent };

            await Identifier.create(residentIdentifier);
            attachIdentiferToResponse({ res, resident: residentIdentifier });
            req.residentID = residentID;
            return next();
        }
    } catch (error) {
        console.log(error);
        throw new CustomError.UnauthenticatedError('Resident Authentication Invalid');
    }
};

const authenticateResidentOfGetAllReports = async (req, res, next) => {
    const { identifier } = req.signedCookies;
    try {
        if (identifier) {
            console.log('had identifier');
            const payload = isTokenValid(identifier);
            const existingIdentifier = await Identifier.findOne({
                residentID: payload.resident.residentID
            });

            if (!existingIdentifier || !existingIdentifier?.isValid) {
                throw new CustomError.UnauthenticatedError('Resident Authentication Invalid');
            }
            attachIdentiferToResponse({ res, resident: payload.resident });

            req.residentID = payload.resident.residentID;
            return next();
        } else {
            console.log('did not have identifier');
            return next();
        }
    } catch (error) {
        console.log(error);
        throw new CustomError.UnauthenticatedError('Resident Authentication Invalid');
    }
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};

module.exports = {
    authenticateUser,
    authorizePermissions,
    authenticateResidentOfCreateReport,
    authenticateResidentOfGetAllReports
};
