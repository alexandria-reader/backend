"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const translations_1 = (0, tslib_1.__importDefault)(require("../services/translations"));
const router = express_1.default.Router();
// router.get('/', async (_req, res) => {
//   const results = await translation.getAll();
//   res.send(results);
// });
router.get('/', (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const results = yield translations_1.default.getAllByUser(Number(user.id));
    res.json(results);
}));
router.get('/:id', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const translationId = Number(req.params.id);
    const result = yield translations_1.default.getOne(translationId);
    res.send(result);
}));
router.get('/word/:word/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const data = {
        word: req.params.word,
    };
    const word = decodeURIComponent(data.word);
    const result = yield translations_1.default.getByWord(word, user.id);
    res.send(result);
}));
router.get('/word/:word/target/:targetId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const data = {
        word: req.params.word,
        targetId: req.params.targetId,
    };
    const word = decodeURIComponent(data.word);
    const { targetId } = data;
    const translationRes = yield translations_1.default.getAllByWordByLang(word, targetId);
    res.send(translationRes);
}));
router.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { wordId, translation, targetLanguageId, context, } = req.body;
    const newTranslation = yield translations_1.default.add(Number(wordId), translation, targetLanguageId);
    if (newTranslation.id) {
        yield translations_1.default.addToUsersTranslations(Number(user.id), newTranslation.id, context);
    }
    res.send(newTranslation);
}));
router.delete('/:translationId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { translationId } = req.params;
    const deleted = yield translations_1.default.remove(Number(translationId));
    res.status(204).send(deleted);
}));
router.put('/translation/:transId', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const data = {
        trans: req.body.translation,
        id: req.params.transId,
    };
    const { trans, id } = data;
    const updated = yield translations_1.default.update(trans, Number(id));
    res.send(updated);
}));
exports.default = router;
