"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const words_1 = (0, tslib_1.__importDefault)(require("../services/words"));
const router = express_1.default.Router();
router.get('/', (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const allWords = yield words_1.default.getAll();
    res.json(allWords);
}));
router.get('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const wordById = yield words_1.default.getById(id);
    res.json(wordById);
}));
router.get('language/:langId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { langId } = req.params;
    const userwordsInLanguage = yield words_1.default.getUserwordsByLanguage(langId, Number(user.id));
    res.json(userwordsInLanguage);
}));
router.get('/text/:textId/language/:langId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { textId, langId } = req.params;
    const userwordsInText = yield words_1.default.getUserwordsInText(Number(user.id), Number(textId), langId, true);
    res.json(userwordsInText);
}));
router.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const userWordData = req.body;
    const newUserWord = yield words_1.default.addNewUserWord(user, userWordData);
    res.status(201).json(newUserWord);
}));
router.put('/:wordId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { status } = req.body;
    const { wordId } = req.params;
    const updatedStatus = yield words_1.default.updateStatus(Number(wordId), Number(user.id), status);
    res.send(updatedStatus);
}));
router.delete('/:wordId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const id = req.params.wordId;
    const result = yield words_1.default.remove(Number(id));
    res.status(204).json(result);
}));
exports.default = router;
