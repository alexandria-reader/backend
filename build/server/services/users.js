"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const bcrypt_1 = (0, tslib_1.__importDefault)(require("bcrypt"));
const users_1 = (0, tslib_1.__importDefault)(require("../data-access/users"));
const types_1 = require("../types");
const sanitizeUser = function (user) {
    const santizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        currentKnownLanguageId: user.currentKnownLanguageId,
        currentLearnLanguageId: user.currentLearnLanguageId,
    };
    return santizedUser;
};
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.getAll();
        const users = result.rows;
        return users;
    });
};
const addNew = function (username, password, email, knownLanguageId, learnLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const emailExists = yield users_1.default.getByEmail(email);
        if (emailExists.rowCount > 0)
            throw boom_1.default.notAcceptable('Email already in use.');
        const saltRounds = 10;
        const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
        const result = yield users_1.default.addNew(username, passwordHash, email, knownLanguageId, learnLanguageId);
        const newUser = result.rows[0];
        const santizedNewUser = sanitizeUser(newUser);
        return santizedNewUser;
    });
};
const verifyPassword = function (userId, password) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.getById(userId);
        const user = result.rows[0];
        const passwordsMatch = yield bcrypt_1.default.compare(password, user.password_hash);
        return passwordsMatch;
    });
};
const updatePassword = function (userId, currentPassword, newPassword) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (!currentPassword) {
            throw boom_1.default.notAcceptable('You must submit your current password.');
        }
        else if (!newPassword) {
            throw boom_1.default.notAcceptable('You must submit a new password.');
        }
        const passwordsMatch = yield verifyPassword(userId, currentPassword);
        if (passwordsMatch) {
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(newPassword, saltRounds);
            const result = yield users_1.default.updatePassword(userId, passwordHash);
            if (result.rowCount === 1) {
                return { message: 'Your password has been updated' };
            }
        }
        throw boom_1.default.notAcceptable('Incorrect password.');
    });
};
const getById = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.getById(userId);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('cannot find user with this id');
        return sanitizeUser((0, types_1.convertUserTypes)(result.rows[0]));
    });
};
const remove = function (userId, password) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const passwordsMatch = yield verifyPassword(userId, password);
        if (passwordsMatch) {
            const result = yield users_1.default.remove(userId);
            if (result.rowCount > 0) {
                const deletedUser = result.rows[0];
                const santizedDeleteUser = sanitizeUser(deletedUser);
                return santizedDeleteUser;
            }
        }
        throw boom_1.default.unauthorized('Incorrect password.');
    });
};
// eslint-disable-next-line max-len
const setUserLanguages = function (currentKnownId, currentLearnId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield users_1.default.setUserLanguages(currentKnownId, currentLearnId, userId);
        if (result.rowCount === 0)
            throw boom_1.default.notAcceptable('Something went wrong');
        return sanitizeUser((0, types_1.convertUserTypes)(result.rows[0]));
    });
};
exports.default = {
    sanitizeUser,
    getAll,
    addNew,
    updatePassword,
    remove,
    getById,
    verifyPassword,
    setUserLanguages,
};
