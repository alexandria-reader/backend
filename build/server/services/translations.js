"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const translations_1 = (0, tslib_1.__importDefault)(require("../data-access/translations"));
const types_1 = require("../types");
const getAllByUser = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const results = yield translations_1.default.getAllByUser(userId);
        if (!results.rows)
            throw boom_1.default.notFound('No translations found for this user.');
        return results.rows.map((dbItem) => (0, types_1.convertTranslationTypes)(dbItem));
    });
};
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const results = yield translations_1.default.getAll();
        return results.rows.map((dbItem) => (0, types_1.convertTranslationTypes)(dbItem));
    });
};
const getOne = function (translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default.getOne(translationId);
        if (!result.rows)
            throw boom_1.default.notFound('No translations with this id is found.');
        return (0, types_1.convertTranslationTypes)(result.rows[0]);
    });
};
const getByWord = function (word, userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const results = yield translations_1.default.getByWord(word, userId);
        if (!results.rows)
            throw boom_1.default.notFound('No translations found for this word.');
        return results.rows.map((dbItem) => (0, types_1.convertTranslationTypes)(dbItem));
    });
};
const getAllByWordByLang = function (word, langId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const results = yield translations_1.default.getAllByWordByLang(word, langId);
        if (!results.rows)
            throw boom_1.default.notFound('No translations found for word in language provided.');
        return results.rows.map((dbItem) => (0, types_1.convertTranslationTypes)(dbItem));
    });
};
const add = function (wordId, translation, targetLang) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default.add(wordId, translation, targetLang);
        if (!result.rows)
            throw boom_1.default.notFound('Adding new translation not successful.');
        return result.rows.map((dbItem) => (0, types_1.convertTranslationTypes)(dbItem))[0];
    });
};
const addToUsersTranslations = function (userId, translationId, context) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default.addToUsersTranslations(userId, translationId, context);
        if (!result.rows)
            throw boom_1.default.notFound('Adding new translation with given user and translation id input not successful.');
        return result;
    });
};
const update = function (translation, translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default.update(translation, translationId);
        if (!result.rows)
            throw boom_1.default.notFound('Updating translation with given translation id not successful.');
        return result;
    });
};
const remove = function (translationId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield translations_1.default.remove(translationId);
        if (!result.rows)
            throw boom_1.default.notFound('Removing translation not successful.');
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
