"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ALL_TEXTS = `
    SELECT * FROM texts`;
        const result = yield (0, db_query_1.default)(ALL_TEXTS);
        return result;
    });
};
const getById = function (textId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const TEXT_BY_ID = `
    SELECT * FROM texts 
     WHERE id = %s`;
        const result = yield (0, db_query_1.default)(TEXT_BY_ID, textId);
        return result;
    });
};
const getByUser = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const TEXTS_BY_USER = `
      SELECT * FROM texts
       WHERE user_id = %s
    ORDER BY last_opened DESC NULLS LAST`;
        const result = yield (0, db_query_1.default)(TEXTS_BY_USER, userId);
        return result;
    });
};
const getByUserAndLanguage = function (userId, languageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const TEXTS_BY_USER = `
      SELECT * FROM texts
       WHERE user_id = %L AND language_id = %L
    ORDER BY last_opened DESC NULLS LAST`;
        const result = yield (0, db_query_1.default)(TEXTS_BY_USER, userId, languageId);
        return result;
    });
};
const addNew = function (textObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const { userId, languageId, title, author, body, sourceURL, sourceType, } = textObject;
        const ADD_TEXT = `
    INSERT INTO texts (user_id, language_id, title, author,
                       body, ts_config, source_url, source_type)
         VALUES (%s, %L, %L, %L, %L, 
                 (SELECT "name" FROM languages AS l WHERE l.id = %L)::regconfig, %L, %L)
      RETURNING *`;
        const result = yield (0, db_query_1.default)(ADD_TEXT, userId, languageId, title, author || null, body, languageId, sourceURL || null, sourceType || null);
        return result;
    });
};
const update = function (textObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const { id, userId, languageId, title, author, body, sourceURL, sourceType, } = textObject;
        const ADD_TEXT = `
       UPDATE texts 
          SET user_id = %s, 
              language_id = %L, 
              title = %L, 
              author = %L, 
              body = %L, 
              source_url = %L, 
              source_type = %L
        WHERE id = %s 
    RETURNING *`;
        const result = yield (0, db_query_1.default)(ADD_TEXT, userId, languageId, title, author || null, body, sourceURL || null, sourceType || null, id);
        return result;
    });
};
const remove = function (textId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const REMOVE_TEXT = `
  DELETE FROM texts 
        WHERE id = %s
    RETURNING *`;
        const result = yield (0, db_query_1.default)(REMOVE_TEXT, textId);
        return result;
    });
};
exports.default = {
    getAll,
    getByUserAndLanguage,
    getById,
    getByUser,
    addNew,
    update,
    remove,
};
