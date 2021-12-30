"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const supertest_1 = (0, tslib_1.__importDefault)(require("supertest"));
const app_1 = (0, tslib_1.__importDefault)(require("../app"));
const db_query_1 = (0, tslib_1.__importDefault)(require("../model/db-query"));
const api = (0, supertest_1.default)(app_1.default);
const reset = fs_1.default.readFileSync('./src/model/reset.sql', 'utf-8');
beforeAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
    yield (0, db_query_1.default)(`INSERT INTO users (username, password_hash, email)
  VALUES
  ('eamon', 'eamonpwhash', 'eamon@example.com'),
  ('dana', 'danapwhash', 'dana@example.com'),
  ('marc', 'marcpwhash', 'marc@example.com');

  INSERT INTO languages (id, "name") 
  VALUES
  ('en', 'english'),
  ('de', 'german'),
  ('fr', 'french');
  `);
}));
xdescribe('Testing adding texts', () => {
    test('Texts are returned as json, there are no users', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const response = yield api
            .get('/api/texts')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const responseBody = JSON.parse(response.text);
        expect(responseBody).toHaveLength(0);
    }));
    test('A text is added successfully', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const text = {
            userId: 1,
            languageId: 'en',
            title: 'The Little Match Girl',
            body: 'It was so terribly cold.',
        };
        const response = yield api
            .post('/api/texts')
            .send(text)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        expect(response.text).toMatch(/The Little Match Girl/);
    }));
    test('Texts can be found by id', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const response = yield api
            .get('/api/texts/1')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.text).toMatch(/The Little Match Girl/);
    }));
    test('Texts can be updated', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const text = {
            userId: 1,
            languageId: 'en',
            title: 'The Little Match Boy',
            body: 'It was so terribly cold.',
        };
        const response = yield api
            .put('/api/texts/1')
            .send(text)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.text).toMatch(/The Little Match Boy/);
    }));
});
afterAll(() => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield (0, db_query_1.default)(reset);
}));
