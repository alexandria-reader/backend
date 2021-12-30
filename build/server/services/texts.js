"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const texts_1 = (0, tslib_1.__importDefault)(require("../data-access/texts"));
const types_1 = require("../types");
const getAll = function () {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield texts_1.default.getAll();
        return result.rows.map((dbItem) => (0, types_1.convertTextTypes)(dbItem));
    });
};
const getById = function (textId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield texts_1.default.getById(textId);
        if (result.rowCount === 0)
            throw boom_1.default.notFound('Could not find text with this id.');
        return (0, types_1.convertTextTypes)(result.rows[0]);
    });
};
const getByUser = function (userId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield texts_1.default.getByUser(userId);
        return result.rows.map((dbItem) => (0, types_1.convertTextTypes)(dbItem));
    });
};
const getByUserAndLanguage = function (userId, languageId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield texts_1.default.getByUserAndLanguage(userId, languageId);
        return result.rows.map((dbItem) => (0, types_1.convertTextTypes)(dbItem));
    });
};
const addNew = function (textObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield texts_1.default.addNew(textObject);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not add new text.');
        return (0, types_1.convertTextTypes)(result.rows[0]);
    });
};
const update = function (textObject) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield texts_1.default.update(textObject);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not update text.');
        return (0, types_1.convertTextTypes)(result.rows[0]);
    });
};
const remove = function (textId) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const result = yield texts_1.default.remove(textId);
        if (result.rowCount === 0)
            throw boom_1.default.badRequest('Could not remove text.');
        return (0, types_1.convertTextTypes)(result.rows[0]);
    });
};
exports.default = {
    getAll,
    getById,
    getByUserAndLanguage,
    getByUser,
    addNew,
    update,
    remove,
};
