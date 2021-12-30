"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const getAllByUser = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const FIND_TRANSLATIONS = 'SELECT * FROM translations AS t JOIN users_translations AS ut ON t.id = ut.translation_id AND user_id = %L';
        const results = yield (0, db_query_1.default)(FIND_TRANSLATIONS, userId);
        return results;
    });
};
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const FIND_TRANSLATIONS = 'SELECT * FROM translations';
        const results = yield (0, db_query_1.default)(FIND_TRANSLATIONS);
        return results;
    });
};
const getOne = function (translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const FIND_TRANSLATION = 'SELECT * FROM translations WHERE id = %L';
        const result = yield (0, db_query_1.default)(FIND_TRANSLATION, translationId);
        return result;
    });
};
const getByWord = function (word, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const FIND_WORD_ID = `
          SELECT * FROM words WHERE word = %L`;
        const wordId = yield (0, db_query_1.default)(FIND_WORD_ID, word);
        const FIND_WORD_TRAN = `SELECT * FROM translations AS t 
            JOIN users_translations AS ut 
            ON t.id = ut.translation_id 
            WHERE ut.user_id = %L AND t.word_id = %L;`;
        const results = yield (0, db_query_1.default)(FIND_WORD_TRAN, userId, wordId.rows[0].id);
        return results;
    });
};
const getAllByWordByLang = function (word, langId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const FIND_WORD_ID = `
          SELECT * FROM words WHERE word = %L`;
        const wordId = yield (0, db_query_1.default)(FIND_WORD_ID, word);
        const FIND_TRANSLATIONS = 'SELECT * FROM translations WHERE word_id = %L AND target_language_id = %L';
        const results = yield (0, db_query_1.default)(FIND_TRANSLATIONS, wordId.rows[0].id, langId);
        return results;
    });
};
const add = function (wordId, translation, targetLang) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const INSERT_TRANSLATION = 'INSERT INTO translations (word_id, translation, target_language_id) VALUES (%L, %L, %L) RETURNING *';
        const results = yield (0, db_query_1.default)(INSERT_TRANSLATION, wordId, translation, targetLang);
        return results;
    });
};
const addToUsersTranslations = function (userId, translationId, context) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const USER_TRANSLATION = 'INSERT INTO users_translations (user_id, translation_id, context) VALUES(%L, %L, %L) RETURNING users_translations.*';
        const result = yield (0, db_query_1.default)(USER_TRANSLATION, userId, translationId, context);
        return result;
    });
};
const update = function (translation, translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const UPDATE_TRANSLATION = 'UPDATE translations SET translation = %L WHERE id = %L RETURNING translations.*';
        const result = yield (0, db_query_1.default)(UPDATE_TRANSLATION, translation, translationId);
        return result;
    });
};
const remove = function (translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const REMOVE_USERS_TRANSLATIONS = 'DELETE FROM users_translations WHERE translation_id = %L RETURNING *';
        const result = yield (0, db_query_1.default)(REMOVE_USERS_TRANSLATIONS, translationId);
        return result;
    });
};
exports.default = {
    getAllByUser,
    getAll,
    getOne,
    getByWord,
    getAllByWordByLang,
    add,
    addToUsersTranslations,
    update,
    remove,
};
