"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const languages_1 = (0, tslib_1.__importDefault)(require("../data-access/languages"));
const types_1 = require("../types");
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield languages_1.default.getAll();
        return result.rows.map((dbItem) => (0, types_1.convertLanguageTypes)(dbItem));
    });
};
const getById = function (languageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield languages_1.default.getById(languageId);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('Could not find language with this id.');
        return (0, types_1.convertLanguageTypes)(result.rows[0]);
    });
};
const addNew = function (languageObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield languages_1.default.addNew(languageObject);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('Could not add language.');
        return (0, types_1.convertLanguageTypes)(result.rows[0]);
    });
};
exports.default = {
    getAll,
    getById,
    addNew,
};
