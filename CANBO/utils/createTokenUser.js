const createTokenUser = (user) => {
    return { userId: user._id, role: user.role, assignedArea: user.assignedArea };
};

module.exports = createTokenUser;
