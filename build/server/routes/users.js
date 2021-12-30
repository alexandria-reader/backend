"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const users_1 = (0, tslib_1.__importDefault)(require("../services/users"));
const translations_1 = (0, tslib_1.__importDefault)(require("../services/translations"));
const middleware_1 = require("../utils/middleware");
const userRouter = express_1.default.Router();
userRouter.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { username, password, email, currentKnownLanguageId, currentLearnLanguageId, } = req.body;
    const newUser = yield users_1.default.addNew(username, password, email, currentKnownLanguageId, currentLearnLanguageId);
    res.status(201).json(newUser);
}));
userRouter.post('/translation/:translationId', middleware_1.getUserFromToken, (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { translationId, context } = req.body;
    yield translations_1.default.addToUsersTranslations(Number(user.id), translationId, context);
    res.status(201).send();
}));
userRouter.get('/', (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const allUsers = yield users_1.default.getAll();
    res.json(allUsers);
}));
userRouter.put('/change-password', middleware_1.getUserFromToken, (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { currentPassword, newPassword } = req.body;
    const response = yield users_1.default.updatePassword(user.id, currentPassword, newPassword);
    res.json(response);
}));
userRouter.delete('/', middleware_1.getUserFromToken, (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { password } = req.body;
    yield users_1.default.remove(user.id, password);
    res.status(204).send();
}));
// update user languages
userRouter.put('/set-languages', middleware_1.getUserFromToken, (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { currentKnownLanguageId, currentLearnLanguageId } = req.body;
    const updatedUser = yield users_1.default.setUserLanguages(currentKnownLanguageId, currentLearnLanguageId, user.id);
    return res.json(updatedUser);
}));
exports.default = userRouter;
