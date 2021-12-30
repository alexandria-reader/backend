"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const SELECT_ALL_USERS = 'SELECT * FROM users';
        const result = yield (0, db_query_1.default)(SELECT_ALL_USERS);
        return result;
    });
};
const getByEmail = function (email) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const CHECK_EMAIL = 'SELECT * FROM users WHERE email = %L';
        const result = yield (0, db_query_1.default)(CHECK_EMAIL, email);
        return result;
    });
};
const addNew = function (username, passwordHash, email, knownLanguageId, learnLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ADD_USER = 'INSERT INTO users (username, password_hash, email, current_known_language_id, current_learn_language_id) Values (%L, %L, %L, %L, %L) RETURNING *';
        const result = yield (0, db_query_1.default)(ADD_USER, username, passwordHash, email, knownLanguageId, learnLanguageId);
        return result;
    });
};
const getById = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const findUserById = 'SELECT * FROM users WHERE id = %L';
        const result = yield (0, db_query_1.default)(findUserById, userId);
        return result;
    });
};
const remove = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const deleteUser = 'DELETE FROM users WHERE id = %L RETURNING *';
        const result = yield (0, db_query_1.default)(deleteUser, userId);
        return result;
    });
};
const setUserLanguages = function (currentKnownLanguageId, currentLearnLanguageId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const setKnownLanguage = 'UPDATE users SET current_known_language_id = %L, current_learn_language_id = %L WHERE id = %L RETURNING *';
        const result = yield (0, db_query_1.default)(setKnownLanguage, currentKnownLanguageId, currentLearnLanguageId, userId);
        return result;
    });
};
const updatePassword = function (userId, newPasswordHash) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const UPDATE_PASSWORD = 'UPDATE users SET password_hash = %L WHERE id = %L';
        const result = yield (0, db_query_1.default)(UPDATE_PASSWORD, newPasswordHash, userId);
        return result;
    });
};
exports.default = {
    // getUserByUsername,
    getByEmail,
    addNew,
    getAll,
    getById,
    remove,
    setUserLanguages,
    updatePassword,
};
