const { createJWT, isTokenValid, attachCookiesToResponse, attachIdentiferToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkIndividualPermissions');

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    attachIdentiferToResponse,
    createTokenUser,
    checkPermissions
};
