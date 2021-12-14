import fs from 'fs';
import dbQuery from '../model/db-query';
import words from '../services/words';
import { Word } from '../types';

const init = fs.readFileSync('./src/model/wordServices.test.init.sql', 'utf-8');
const reset = fs.readFileSync('./src/model/wordServices.test.reset.sql', 'utf-8');

beforeAll(async () => {
  await dbQuery(init);
});


describe('Getting words', () => {
  test('getAll: get all 10 words from test database', async () => {
    const allWords = await words.getAll();
    expect(allWords).toHaveLength(10);
  });


  test('getById: get word with id 7', async () => {
    const wordById = await words.getById(7);
    expect(wordById?.word).toBe('bareheaded');
  });


  test('getById: get word with non-existent id 999 is null', async () => {
    const wordById = await words.getById(999);
    expect(wordById).toBe(null);
  });


  test('getByLanguageAndUser: find all words for user 2 in English', async () => {
    const wordsByLanguageAndUser = await words.getByLanguageAndUser('en', 2);
    expect(wordsByLanguageAndUser).toHaveLength(5);
    expect(wordsByLanguageAndUser).toContainEqual({
      id: 6,
      languageId: 'en',
      word: 'roast goose',
    });
  });


  test('getUserwordsInText: find all words that user 1 marked in text 1', async () => {
    const userWords = await words.getUserwordsInText(1, 1);
    expect(userWords).toHaveLength(4);
    expect(userWords).toContainEqual({
      id: 9,
      word: 'carriages',
    });
  });


  test('addNew: add a new word', async () => {
    const wordData: Word = {
      languageId: 'de',
      word: 'Kuchengabel',
    };

    const newWord = await words.addNew(wordData);
    if (newWord) expect(newWord.word).toContain('Kuchengabel');
    expect(await words.getAll()).toHaveLength(11);
  });


  test('addNew: add a word that already exists in the language', async () => {
    const existingWord = await words.getWordInLanguage('Kuchengabel', 'de');

    const wordData: Word = {
      languageId: 'de',
      word: 'Kuchengabel',
    };

    const newWord = await words.addNew(wordData);
    if (newWord) expect(newWord.word).toContain('Kuchengabel');
    if (newWord) expect(newWord.id).toEqual(existingWord?.id);
    expect(await words.getAll()).toHaveLength(11);
  });


  test('remove: removing an existing word', async () => {
    const existingWord = await words.getWordInLanguage('Kuchengabel', 'de');

    if (existingWord?.id) {
      const removedWord = await words.remove(existingWord.id);
      expect(removedWord?.word).toContain('Kuchengabel');
      expect(await words.getAll()).toHaveLength(10);
    }
  });


  test('getStatus: status of word 5 for user 3 in "learning"', async () => {
    const status = await words.getStatus(5, 3);
    expect(status).toBe('learning');
  });


  test('updateStatus: change previous status to "testing"', async() => {
    const updatedStatus = await words.updateStatus(5, 3, 'testing');
    expect(updatedStatus).toBe('testing');

    const status = await words.getStatus(5, 3);
    expect(status).toBe('testing');
  });


  test('addStatus: add status "testing" to word 4 for user 1', async () => {
    const addedStatus = await words.addStatus(4, 1, 'testing');
    expect(addedStatus).toBe('testing');

    const status = await words.getStatus(4, 1);
    expect(status).toBe('testing');
  });
});


afterAll(async () => {
  await dbQuery(reset);
});
