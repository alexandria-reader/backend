"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const translations_1 = (0, tslib_1.__importDefault)(require("../services/translations"));
const reset = fs_1.default.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs_1.default.readFileSync('./src/model/seed.sql', 'utf-8');
beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
    yield (0, db_query_1.default)(seed);
}));
describe('Testing retrieving translations', () => {
    beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield translations_1.default.getAll();
    }));
    test('getAll: retrieve all translations', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const result = yield translations_1.default.getAll();
        expect(result).toHaveLength(24);
    }));
    test('getAllByUser: retrieve all translations for user', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const result = yield translations_1.default.getAllByUser(1);
        if (result) {
            expect(result).toHaveLength(7);
            expect(result[0].translation).toBe('natürlich');
        }
    }));
    test('getOne: retrieve one translations by id', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const result = yield translations_1.default.getOne(2);
        if (result) {
            expect(result.translation).toBe('klar doch');
        }
    }));
    test('getByWord: retrieve translations by word string and user id', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const result = yield translations_1.default.getByWord('roast goose', 2);
        if (result) {
            expect(result[0].translation).toBe('oie rôtie');
        }
    }));
    test('getAllByWordByLang: retrieve translation with word id and target language', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const result = yield translations_1.default.getAllByWordByLang('of course', 'de');
        if (result) {
            expect(result.length).toBe(2);
            expect(result[0].translation).toBe('natürlich');
            expect(result[1].translation).toBe('klar doch');
        }
    }));
});
describe('Testing adding translations', () => {
    test('add: new translation is correctly added', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const wordId = 9;
        const translation = 'voitures';
        const targetLanguageId = 'fr';
        const result = yield translations_1.default.add(wordId, translation, targetLanguageId);
        if (result) {
            expect(result.translation).toContain('voitures');
            expect(result.targetLanguageId).toContain('fr');
        }
    }));
    test('aaddToUsersTranslationsdd: test a new translation is also added to the users_translations table', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const wordId = 9;
        const translation = 'auto';
        const targetLanguageId = 'de';
        const resultTrans = yield translations_1.default.add(wordId, translation, targetLanguageId);
        if (resultTrans.id) {
            const lastTransId = resultTrans.id;
            const result = yield translations_1.default.addToUsersTranslations(1, lastTransId, '');
            if (result) {
                expect(result.rows[0].user_id).toBe(1);
                expect(result.rows[0].translation_id).toBe(lastTransId);
            }
        }
    }));
});
describe('Testing deleting translations', () => {
    test('translation with specified id is deleted', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const id = 1;
        const result = yield translations_1.default.remove(id);
        if (result) {
            const getAll = yield translations_1.default.getAll();
            expect(getAll.length).toBe(26);
        }
    }));
});
describe('Testing updating translations', () => {
    test('update translation with specified id', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const updatedTranslation = 'avide';
        const translationId = 14;
        const result = yield translations_1.default.update(updatedTranslation, translationId);
        if (result) {
            expect(result.rows[0].translation).toContain('avide');
            expect(result.rows[0].target_language_id).toContain('fr');
        }
    }));
});
afterAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
}));
