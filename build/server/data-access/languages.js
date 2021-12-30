"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ALL_LANGUAGES = `
    SELECT * FROM languages`;
        const result = yield (0, db_query_1.default)(ALL_LANGUAGES);
        return result;
    });
};
const getById = function (languageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const LANGUAGE_BY_ID = `
    SELECT * FROM languages WHERE id = %L`;
        const result = yield (0, db_query_1.default)(LANGUAGE_BY_ID, languageId);
        return result;
    });
};
const addNew = function (languageObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const { id, name, eachCharIsWord, isRightToLeft, } = languageObject;
        const ADD_LANGUAGE = `
    INSERT INTO languages (id, name, each_char_is_word, is_right_to_left)
         VALUES (%L, %L, %L, %L)
      RETURNING *`;
        const result = yield (0, db_query_1.default)(ADD_LANGUAGE, id, name, eachCharIsWord, isRightToLeft);
        return result;
    });
};
const getKnownByUser = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const KNOWN_BY_USER = `
    SELECT id, 
           name, 
           google_translate_url, 
           each_char_is_word, 
           is_right_to_left, 
           is_native 
      FROM languages AS l
      JOIN users_know_languages ON l.id = known_language_id
     WHERE user_id = %L`;
        const result = yield (0, db_query_1.default)(KNOWN_BY_USER, userId);
        return result;
    });
};
const addKnownByUser = function (languageId, userId, isNative) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ADD_KNOWN_BY_USER = `
    INSERT INTO users_know_languages (language_id, user_id, is_native)
         VALUES (%L, %s, %L)
     RETURNNING *`;
        const userLanguageResult = yield (0, db_query_1.default)(ADD_KNOWN_BY_USER, languageId, userId, isNative);
        // if (userLanguageResult.rowCount === 0) return null;
        // const language = await getById(languageId);
        // if (!language) return null;
        // return { ...language, isNative };
        return userLanguageResult;
    });
};
const getStudiedByUser = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const STUDIED_BY_USER = `
    SELECT l.id, 
           name, 
           google_translate_url, 
           each_char_is_word, 
           is_right_to_left 
      FROM languages AS l
      JOIN users_study_languages ON l.id = study_language_id
     WHERE user_id = %L`;
        const result = yield (0, db_query_1.default)(STUDIED_BY_USER, userId);
        return result;
    });
};
const addStudiedByUser = function (languageId, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ADD_STUDIED_BY_USER = `
    INSERT INTO users_study_languages (language_id, user_id)
         VALUES (%L, %s, %L)
     RETURNNING *`;
        const studyLanguageResult = yield (0, db_query_1.default)(ADD_STUDIED_BY_USER, languageId, userId);
        // if (!studyLanguageResult) return null;
        // const studyLanguage = await getById(languageId);
        return studyLanguageResult;
    });
};
exports.default = {
    getAll,
    getById,
    addNew,
    getKnownByUser,
    addKnownByUser,
    getStudiedByUser,
    addStudiedByUser,
};
