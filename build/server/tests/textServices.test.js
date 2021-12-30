"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const texts_1 = (0, tslib_1.__importDefault)(require("../services/texts"));
const reset = fs_1.default.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs_1.default.readFileSync('./src/model/seed.sql', 'utf-8');
beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
    yield (0, db_query_1.default)(seed);
}));
describe('Getting texts', () => {
    test('getAll: get all 3 words from test database', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const allTexts = yield texts_1.default.getAll();
        expect(allTexts).toHaveLength(3);
    }));
    test('getById: get word with id 2', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const textById = yield texts_1.default.getById(2);
        expect(textById === null || textById === void 0 ? void 0 : textById.title).toBe('Dans la « bibliothèque » de l’artiste zimbabwéen Kudzanai Chiurai');
    }));
    // test('getById: get text with non-existent id 999 returns null', () => {
    //   async function getNonExisting() {
    //     await texts.getById(999);
    //   }
    //   expect(getNonExisting).toThrow();
    // });
    test('addNew: add a new text for user 3', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const textData = {
            userId: 3,
            languageId: 'de',
            title: 'Die Kuchengabel',
            author: 'Marc',
            body: 'Ich kann Käsekuchen nicht ohne Kuchengabel essen.',
        };
        const newText = yield texts_1.default.addNew(textData);
        if (newText)
            expect(newText.title).toBe('Die Kuchengabel');
        expect(yield texts_1.default.getAll()).toHaveLength(4);
    }));
    test('getByUser: gets all texts for user 3', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const userTexts = yield texts_1.default.getByUser(3);
        expect(userTexts).toHaveLength(2);
    }));
    test('remove: removing an existing text', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const existingText = yield texts_1.default.getById(4);
        if (existingText === null || existingText === void 0 ? void 0 : existingText.id) {
            const removedText = yield texts_1.default.remove(existingText.id);
            expect(removedText === null || removedText === void 0 ? void 0 : removedText.title).toBe('Die Kuchengabel');
            expect(yield texts_1.default.getAll()).toHaveLength(3);
        }
    }));
});
afterAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
}));
