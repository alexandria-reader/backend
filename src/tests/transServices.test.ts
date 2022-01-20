/* eslint-disable max-len */
import fs from 'fs';
import dbQuery from '../model/db-query';
import translations from '../services/translations';

const reset = fs.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs.readFileSync('./src/model/seed.sql', 'utf-8');

beforeAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});

xdescribe('Testing retrieving translations', () => {
  test('getAll: retrieve all translations', async () => {
    const result = await translations.getAll();
    expect(result).toHaveLength(24);
  });

  // test('getAllByUser: retrieve all translations for user', async () => {
  //   const result = await translations.getAllByUser(1);
  //   if (result) {
  //     expect(result).toHaveLength(7);
  //     expect(result[0].translation).toBe('natürlich');
  //   }
  // });

  // test('getOne: retrieve one translations by id', async () => {
  //   const result = await translations.getOne(2);
  //   if (result) {
  //     expect(result.translation).toBe('klar doch');
  //   }
  // });

  // test('getByWord: retrieve translations by word string and user id', async () => {
  //   const result = await translations.getByWord('roast goose', 2);
  //   if (result) {
  //     expect(result[0].translation).toBe('oie rôtie');
  //   }
  // });

  // test('getAllByWordByLang: retrieve translation with word id and target language', async () => {
  //   const result = await translations.getAllByWordByLang('of course', 'de');
  //   if (result) {
  //     expect(result.length).toBe(2);
  //     expect(result[0].translation).toBe('natürlich');
  //     expect(result[1].translation).toBe('klar doch');
  //   }
  // });
});

describe('Testing adding translations', () => {
  test('add: new translation is correctly added', async () => {
    const wordId = 9;
    const translation = 'voitures';
    const targetLanguageId = 'fr';

    const result = await translations.add(wordId, translation, targetLanguageId);
    if (result) {
      expect(result.translation).toContain('voitures');
      expect(result.targetLanguageId).toContain('fr');
    }
  });

  xtest('aaddToUsersTranslationsdd: test a new translation is also added to the users_translations table', async () => {
    const wordId = 9;
    const translation = 'auto';
    const targetLanguageId = 'de';

    const resultTrans = await translations.add(wordId, translation, targetLanguageId);
    if (resultTrans.id) {
      const lastTransId = resultTrans.id;
      const result = await translations.addToUsersTranslations(1, lastTransId, '');
      if (result) {
        expect(result).toBe('');
      }
    }
  });
});

describe('Testing deleting translations', () => {
  test('translation with specified id is deleted', async () => {
    const id = 1;
    const result = await translations.remove(id);
    if (result) {
      const getAll = await translations.getAll();
      expect(getAll.length).toBe(25);
    }
  });
});

describe('Testing updating translations', () => {
  test('update translation with specified id', async () => {
    const updatedTranslation = 'avide';
    const translationId = 14;
    const result = await translations.update(translationId, updatedTranslation);
    if (result) {
      expect(result.translation).toContain('avide');
      expect(result.targetLanguageId).toContain('fr');
    }
  });
});

afterAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});
