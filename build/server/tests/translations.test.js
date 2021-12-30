"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const supertest_1 = (0, tslib_1.__importDefault)(require("supertest"));
const app_1 = (0, tslib_1.__importDefault)(require("../app"));
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const api = (0, supertest_1.default)(app_1.default);
const reset = fs_1.default.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs_1.default.readFileSync('./src/model/seed.sql', 'utf-8');
beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
    yield (0, db_query_1.default)(seed);
}));
xdescribe('Testing retrieving translations', () => {
    beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api.get('/api/translations');
    }));
    test('retrieve all translations', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/translations')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect((response) => {
            expect(response.body.length).toEqual(24);
        });
    }));
    test('retrieve all translations for user', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/translations/user/1')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect((response) => {
            expect(response.body[0].translation).toEqual('natürlich');
        });
    }));
    test('retrieve one translations by id', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/translations/2')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect((response) => {
            expect(response.body.translation).toEqual('klar doch');
        });
    }));
    test('retrieve translations by word for user', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/translations/word/of%20course/user/1')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect((response) => {
            expect(response.body[0].translation).toEqual('natürlich');
        });
    }));
    test('retrieve translation with specified id and target language', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/translations/word/all%20day%20long/target/fr')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect((response) => {
            expect(response.body[0].translation).toEqual('toute la journée');
        });
    }));
});
xdescribe('Testing adding translations', () => {
    test('new translation is correctly added', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield (0, db_query_1.default)('SELECT * FROM languages');
        const ADD_WORD = 'INSERT INTO words (language_id, word, ts_config) VALUES(%L, %L, %L) RETURNING *';
        const LAST_ADD_WORD = yield (0, db_query_1.default)(ADD_WORD, 'en', 'hello', 'english');
        yield (0, db_query_1.default)('SELECT * FROM words WHERE id=11');
        const LAST_ID = Number(LAST_ADD_WORD.rows[0].id);
        const newTranslation = {
            wordId: LAST_ID,
            translation: 'allo',
            targetLang: 'fr',
        };
        yield api
            .post('/api/translations/user/1')
            .send(newTranslation)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');
    }));
});
xdescribe('Testing deleting translations', () => {
    test('translation with specified id is deleted', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .delete('/api/translations/23')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');
    }));
});
xdescribe('Testing updating translations', () => {
    test('update translation with specified id', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const updatedTranslation = {
            translation: 'affamé',
        };
        yield api
            .put('/api/translations/translation/14')
            .send(updatedTranslation)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');
    }));
});
afterAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
}));
