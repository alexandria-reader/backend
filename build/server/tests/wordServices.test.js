"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const words_1 = (0, tslib_1.__importDefault)(require("../services/words"));
const reset = fs_1.default.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs_1.default.readFileSync('./src/model/seed.sql', 'utf-8');
beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
    yield (0, db_query_1.default)(seed);
}));
describe('Getting words', () => {
    test('getAll: get all 10 words from test database', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const allWords = yield words_1.default.getAll();
        expect(allWords).toHaveLength(10);
    }));
    test('getById: get word with id 7', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const wordById = yield words_1.default.getById(7);
        expect(wordById === null || wordById === void 0 ? void 0 : wordById.word).toBe('bareheaded');
    }));
    xtest('getById: get word with non-existent id 999 is null', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        function getNonExisting() {
            return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                yield words_1.default.getById(999);
            });
        }
        expect(getNonExisting).toThrow();
    }));
    test('getByLanguageAndUser: find all words for user 2 in English', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const wordsByLanguageAndUser = yield words_1.default.getByLanguageAndUser('en', 2);
        expect(wordsByLanguageAndUser).toHaveLength(5);
        expect(wordsByLanguageAndUser).toContainEqual({
            id: 6,
            languageId: 'en',
            word: 'roast goose',
        });
    }));
    test('getByUser: find all words that user 1 marked in text 1', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const userWords = yield words_1.default.getUserwordsInText(1, 1, 'de');
        expect(userWords).toHaveLength(3);
    }));
    test('addNew: add a new word', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const wordData = {
            languageId: 'de',
            word: 'Kuchengabel',
        };
        const newWord = yield words_1.default.addNew(wordData);
        if (newWord)
            expect(newWord.word).toContain('Kuchengabel');
        expect(yield words_1.default.getAll()).toHaveLength(11);
    }));
    test('addNew: add a word that already exists in the language', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const existingWord = yield words_1.default.getWordInLanguage('Kuchengabel', 'de');
        const wordData = {
            languageId: 'de',
            word: 'Kuchengabel',
        };
        const newWord = yield words_1.default.addNew(wordData);
        if (newWord)
            expect(newWord.word).toContain('Kuchengabel');
        if (newWord)
            expect(newWord.id).toEqual(existingWord === null || existingWord === void 0 ? void 0 : existingWord.id);
        expect(yield words_1.default.getAll()).toHaveLength(11);
    }));
    test('remove: removing an existing word', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const existingWord = yield words_1.default.getWordInLanguage('Kuchengabel', 'de');
        if (existingWord === null || existingWord === void 0 ? void 0 : existingWord.id) {
            const removedWord = yield words_1.default.remove(existingWord.id);
            expect(removedWord === null || removedWord === void 0 ? void 0 : removedWord.word).toContain('Kuchengabel');
            expect(yield words_1.default.getAll()).toHaveLength(10);
        }
    }));
    test('getStatus: status of word 5 for user 3 in "learning"', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const status = yield words_1.default.getStatus(5, 3);
        expect(status).toBe('learning');
    }));
    test('updateStatus: change previous status to "familiar"', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const updatedStatus = yield words_1.default.updateStatus(5, 3, 'familiar');
        expect(updatedStatus).toBe('familiar');
        const status = yield words_1.default.getStatus(5, 3);
        expect(status).toBe('familiar');
    }));
    test('addStatus: add status "familiar" to word 4 for user 1', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const addedStatus = yield words_1.default.addStatus(4, 1, 'familiar');
        expect(addedStatus).toBe('familiar');
        const status = yield words_1.default.getStatus(4, 1);
        expect(status).toBe('familiar');
    }));
});
afterAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
}));
