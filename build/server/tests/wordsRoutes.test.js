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
xdescribe('Testing getting all words', () => {
    beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api.get('/api/words');
    }));
    test('retrieve all words', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/words/')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect((response) => {
            expect(response.body.length).toEqual(10);
        });
    }));
    test('retrieve word by id', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/words/1')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect((response) => {
            expect(response.body.word).toEqual('of course');
        });
    }));
    test('retrieve word by language and user id', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/words/en/user/1')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect((response) => {
            expect(response.body[0].word).toEqual('of course');
        });
    }));
});
xdescribe('Testing adding a word', () => {
    test('add a new word', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const word = {
            languageId: 'en',
            word: 'hellotest',
        };
        yield api
            .post('/api/words/user/1')
            .send(word)
            .expect(201);
    }));
});
xdescribe('Testing updating a word', () => {
    test('modify an existing word', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const data = { status: 'learned' };
        yield api
            .put('/api/words/1/user/1')
            .send(data)
            .expect(200)
            .expect('learned');
    }));
});
xdescribe('Testing deleting a word', () => {
    test('delete an existing word', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield api
            .delete('/api/words/1')
            .expect(204);
    }));
});
afterAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
}));
