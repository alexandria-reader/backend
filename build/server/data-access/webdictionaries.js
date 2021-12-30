"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const ALL_DICTIONARIES = `
    SELECT * FROM webdictionaries`;
        const result = yield (0, db_query_1.default)(ALL_DICTIONARIES);
        return result;
    });
};
const getById = function (webdictionaryId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const WEBDICTIONARY_BY_ID = `
    SELECT * FROM webdictionaries
     WHERE id = %s`;
        const result = yield (0, db_query_1.default)(WEBDICTIONARY_BY_ID, webdictionaryId);
        return result;
    });
};
const getBySource = function getBySourceLanguage(sourceLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const DICTIONARIES_BY_SOURCE = `
    SELECT * FROM webdictionaries
     WHERE source_language_id = %L`;
        const result = yield (0, db_query_1.default)(DICTIONARIES_BY_SOURCE, sourceLanguageId);
        return result;
    });
};
const getByTarget = function getByTargetLanguage(targetLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const DICTIONARIES_BY_TARGET = `
    SELECT * FROM webdictionaries
     WHERE target_language_id = %L`;
        const result = yield (0, db_query_1.default)(DICTIONARIES_BY_TARGET, targetLanguageId);
        return result;
    });
};
const getPrefWebdicts = function getPreferredWebdictionaries(userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const PREFERRED_WEBDICTIONARIES = `
    SELECT wd.id,
           source_language_id, 
           target_language_id, 
           name, 
           url FROM webdictionaries AS wd
      JOIN webdictionary_preferencess AS wp ON wp.webdictionary_id = wd.id 
     WHERE wp.user_id = %s`;
        const result = yield (0, db_query_1.default)(PREFERRED_WEBDICTIONARIES, userId);
        return result;
    });
};
const addNew = function (webdictionaryObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const { sourceLanguageId, targetLanguageId, name, url, } = webdictionaryObject;
        const ADD_WEBDICTIONARY = `
    INSERT INTO webdictionaries (source_language_id, target_language_id, "name", "url")
         VALUES (%L, %L, %L, %L)
      RETURNING *`;
        const result = yield (0, db_query_1.default)(ADD_WEBDICTIONARY, sourceLanguageId, targetLanguageId, name, url);
        return result;
    });
};
exports.default = {
    getAll,
    getById,
    getBySource,
    getByTarget,
    addNew,
    getPrefWebdicts,
};
