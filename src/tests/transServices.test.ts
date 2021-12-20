/* eslint-disable max-len */
import fs from 'fs';
import dbQuery from '../model/db-query';
import translations from '../services/translations';
import contexts from '../services/contexts';

const reset = fs.readFileSync('./src/model/reset.sql', 'utf-8');
const seed = fs.readFileSync('./src/model/seed.sql', 'utf-8');

beforeAll(async () => {
  await dbQuery(reset);
  await dbQuery(seed);
});

describe('Testing retrieving translations', () => {
  beforeAll(async () => {
    await translations.getAll();
  });

  test('getAll: retrieve all translations', async () => {
    const result = await translations.getAll();
    expect(result).toHaveLength(22);
  });

  test('getAllByUser: retrieve all translations for user', async () => {
    const result = await translations.getAllByUser(1);
    if (result) {
      expect(result).toHaveLength(3);
      expect(result[0].translation).toBe('natürlich');
    }
  });

  test('getOne: retrieve one translations by id', async () => {
    const result = await translations.getOne(2);
    if (result) {
      expect(result.translation).toBe('klar doch');
    }
  });

  test('getByWord: retrieve translations by word string and user id', async () => {
    const result = await translations.getByWord('roast goose', 2);
    if (result) {
      expect(result[0].translation).toBe('oie rôtie');
    }
  });

  test('getAllByWordByLang: retrieve translation with word id and target language', async () => {
    const result = await translations.getAllByWordByLang('of course', 'de');
    if (result) {
      expect(result.length).toBe(2);
      expect(result[0].translation).toBe('natürlich');
      expect(result[1].translation).toBe('klar doch');
    }
  });
});

xdescribe('Testing retrieving contexts', () => {
  test('getAllContextByWordByLang: retrieve contexts by word and language', async () => {
    const result = await contexts.getAllContextByWordByLang('carriages', 'en', 'fr');
    if (result) {
      expect(result[0].snippet).toBe('road, where two carriages had rattled by');
    }
  });

  test('getContextByLangByUser: retrieve context and translation for user, given word id and target language id', async () => {
    await translations.addToUsersTranslations(3, 21);
    const result = await contexts.getContextByLangByUser(3, 9, 'fr');
    if (result) {
      expect(result[0].snippet).toBe('road, where two carriages had rattled by');
    }
  });
});

xdescribe('Testing adding contexts', () => {
  test('add: new context is correctly added', async () => {
    const result = await contexts.addContext('où deux voitures avaient claqué par', 21);
    if (result) {
      expect(result[0].snippet).toContain('où deux voitures avaient claqué par');
    }
  });
});

describe('Testing adding translations', () => {
  test('add: new translation is correctly added', async () => {
    const wordId = 9;
    const translation = 'voitures';
    const targetLanguageId = 'fr';

    const result = await translations.add(wordId, translation, targetLanguageId);
    if (result) {
      expect(result[0].translation).toContain('voitures');
      expect(result[0].targetLanguageId).toContain('fr');
    }
  });

  test('aaddToUsersTranslationsdd: test a new translation is also added to the users_translations table', async () => {
    const wordId = 9;
    const translation = 'auto';
    const targetLanguageId = 'de';

    const resultTrans = await translations.add(wordId, translation, targetLanguageId);
    if (resultTrans[0].id) {
      const lastTransId = resultTrans[0].id;
      const result = await translations.addToUsersTranslations(1, lastTransId);
      if (result) {
        expect(result.rows[0].user_id).toBe(1);
        expect(result.rows[0].translation_id).toBe(lastTransId);
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
      expect(getAll.length).toBe(24);
    }
  });
});

describe('Testing updating translations', () => {
  test('update translation with specified id', async () => {
    const updatedTranslation = 'avide';
    const translationId = 14;
    const result = await translations.update(updatedTranslation, translationId);
    if (result) {
      expect(result.rows[0].translation).toContain('avide');
      expect(result.rows[0].target_language_id).toContain('fr');
    }
  });
});

afterAll(async () => {
  await dbQuery(reset);
});
