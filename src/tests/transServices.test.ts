/* eslint-disable max-len */
import dbQuery from '../model/db-query';
import before from '../model/test-db-before';
import translations from '../services/translations';
import resetDatabase from '../model/test-db-reset';

beforeAll(async () => {
  before.forEach(async (query) => {
    await dbQuery(query);
  });
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

  test('getByWord: retrieve translations by word id for user', async () => {
    const result = await translations.getByWord(6, 3);
    if (result) {
      expect(result[0].translation).toBe('Gänsebraten');
    }
  });

  test('getAllByWordByLang: retrieve translation with word id and target language', async () => {
    const result = await translations.getAllByWordByLang(1, 'de');
    if (result) {
      expect(result.length).toBe(2);
      expect(result[0].translation).toBe('natürlich');
      expect(result[1].translation).toBe('klar doch');
    }
  });

  // Missing context
  // test('getAllContextByLang: retrieve context and translation context by language and word id', async () => {
  //   const result = await translations.getAllContextByLang(9, 'fr');
  //   if (result) {
  //     expect(result.length).toBe(1);
  //     expect(result[0].translation).toBe('chariots');
  //     expect(result[0].targetLanguageId).toBe('fr');
  //   }
  // });

  // Missing context, need to implement context first
  // test('getContextByLangByUser: retrieve context and translation for user, given word id and target language id', async () => {
  //   const result = await translations.getContextByLangByUser(1, 9, 'fr');
  //   if (result) {
  //     expect(result.length).toBe(1);
  //     expect(result[0].translation).toBe('voitures');
  //     expect(result[0].targetLanguageId).toBe('fr');
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
  await dbQuery(resetDatabase);
});
