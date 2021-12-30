"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const webdictionaries_1 = (0, tslib_1.__importDefault)(require("../data-access/webdictionaries"));
const types_1 = require("../types");
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield webdictionaries_1.default.getAll();
        return result.rows.map((dbItem) => (0, types_1.convertWebdictionaryTypes)(dbItem));
    });
};
const getById = function (webdictionaryId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield webdictionaries_1.default.getById(webdictionaryId);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('Could not find webdictionary with this id.');
        return (0, types_1.convertWebdictionaryTypes)(result.rows[0]);
    });
};
const getBySource = function (sourceLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield webdictionaries_1.default.getBySource(sourceLanguageId);
        return result.rows.map((dbItem) => (0, types_1.convertWebdictionaryTypes)(dbItem));
    });
};
const getByTarget = function (targetLanguageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield webdictionaries_1.default.getByTarget(targetLanguageId);
        return result.rows.map((dbItem) => (0, types_1.convertWebdictionaryTypes)(dbItem));
    });
};
const getPrefWebdicts = function getPreferredWebdictionaries(userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield webdictionaries_1.default.getPrefWebdicts(userId);
        return result.rows.map((dbItem) => (0, types_1.convertWebdictionaryTypes)(dbItem));
    });
};
const addNew = function (webdictionaryObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield webdictionaries_1.default.addNew(webdictionaryObject);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not add webdictionary');
        return (0, types_1.convertWebdictionaryTypes)(result.rows[0]);
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
