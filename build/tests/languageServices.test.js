"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const languages_1 = (0, tslib_1.__importDefault)(require("../services/languages"));
const reset = fs_1.default.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs_1.default.readFileSync('./src/model/seed.sql', 'utf-8');
beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
    yield (0, db_query_1.default)(seed);
}));
describe('Getting languages', () => {
    test('getAll: get all 3 languages from test database', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const allTexts = yield languages_1.default.getAll();
        expect(allTexts).toHaveLength(3);
    }));
    test('getById: get word with id "de"', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const languageById = yield languages_1.default.getById('de');
        expect(languageById === null || languageById === void 0 ? void 0 : languageById.name).toBe('german');
    }));
    test('addNew: add a new language', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const languageObject = {
            id: 'jp',
            name: 'japanese',
            eachCharIsWord: false,
            isRightToLeft: false,
        };
        const newLanguage = yield languages_1.default.addNew(languageObject);
        if (newLanguage)
            expect(newLanguage.name).toBe('japanese');
        expect(yield languages_1.default.getAll()).toHaveLength(4);
    }));
    // test('getById: get language with non-existent id "fdd" returns null', async () => {
    //   const languageById = await languages.getById('fdd');
    //   expect(languageById).toBe(null);
    // });
});
afterAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
}));
