import fs from 'fs';
import dbQuery from '../model/db-query';
import languages from '../services/languages';

const init = fs.readFileSync('./src/model/wordServices.test.init.sql', 'utf-8');
const reset = fs.readFileSync('./src/model/wordServices.test.reset.sql', 'utf-8');

beforeAll(async () => {
  await dbQuery(init);
});

describe('Getting languages', () => {
  test('getAll: get all 3 languages from test database', async () => {
    const allTexts = await languages.getAll();
    expect(allTexts).toHaveLength(3);
  });


  test('getById: get word with id "de"', async () => {
    const languageById = await languages.getById('de');
    expect(languageById?.name).toBe('german');
  });


  test('getById: get language with non-existent id "fdd" returns null', async () => {
    const languageById = await languages.getById('fdd');
    expect(languageById).toBe(null);
  });


  test('getKnownByUser: gets all languages known by user 2', async () => {
    const userLanguages = await languages.getKnownByUser(2);
    expect(userLanguages).toHaveLength(2);
  });
});


afterAll(async () => {
  await dbQuery(reset);
});
