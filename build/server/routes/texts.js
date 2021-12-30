"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const texts_1 = (0, tslib_1.__importDefault)(require("../services/texts"));
const router = express_1.default.Router();
router.get('/language/:langId/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const languageId = req.params.langId;
    const allTexts = yield texts_1.default.getByUserAndLanguage(Number(user.id), languageId);
    return res.json(allTexts);
}));
router.get('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const textById = yield texts_1.default.getById(id);
    res.json(textById);
}));
router.get('/', (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const textsByUser = yield texts_1.default.getByUser(Number(user.id));
    return res.json(textsByUser);
}));
router.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const textData = req.body;
    textData.userId = user.id;
    const text = yield texts_1.default.addNew(textData);
    return res.json(text);
}));
router.put('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const textData = req.body;
    const updatedText = yield texts_1.default.update(Object.assign({ id }, textData));
    res.json(updatedText);
}));
router.delete('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield texts_1.default.remove(id);
    res.status(204).send();
}));
exports.default = router;
