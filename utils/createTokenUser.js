const createTokenUser = (user) => {
    return { userId: user._id, role: user.role, asignedArea: user.asignedArea };
};

module.exports = createTokenUser;
